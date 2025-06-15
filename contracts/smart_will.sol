// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract SmartWill is ReentrancyGuard, Ownable {
    using SafeERC20 for IERC20;
    
    uint256 public constant EXECUTION_TRIGGER = 365 days;
    uint256 public constant MAX_BENEFICIARIES = 10;
    uint256 public constant PERCENTAGE_PRECISION = 10000;

    enum WillStatus { 
        Active, 
        Executing, 
        Completed, 
        Cancelled 
    }
    
    struct Beneficiary {
        address payable beneficiaryAddress;
        uint256 percentage;
        string name;
        string email;
        bool claimed;
    }
    
    struct Asset {
        address tokenAddress;
        uint256 amount;
        bool isActive;
    }
    
    struct Will {
        address payable owner;
        uint256 createdAt;
        uint256 lastCheckIn;
        uint256 executionTime;
        bytes32 overridePasswordHash;
        string message;
        Beneficiary[] beneficiaries;
        Asset[] assets;
        WillStatus status;
        bool isActive;
        uint256 totalPercentage;
    }
    
    mapping(address => Will) public wills;
    mapping(address => bool) public hasWill;
    address[] public willOwners;
    mapping(address => uint256) public willOwnerIndex;
    
    uint256 public totalWills;
    uint256 public activeWills;
    uint256 public executedWills;
    
    event WillCreated(address indexed owner, uint256 indexed willId, uint256 beneficiaryCount, uint256 timestamp);
    event WillUpdated(address indexed owner, uint256 timestamp);
    event CheckInPerformed(address indexed owner, uint256 timestamp);
    event DeathTriggered(address indexed owner, uint256 triggerTime);
    event OverrideUsed(address indexed owner, uint256 timestamp);
    event ExecutionStarted(address indexed owner, uint256 executionTime);
    event BeneficiaryClaimed(address indexed owner, address indexed beneficiary, uint256 ethAmount, address[] tokenAddresses, uint256[] tokenAmounts);
    event WillCompleted(address indexed owner, uint256 completionTime);
    event WillCancelled(address indexed owner, uint256 cancellationTime);
    event AssetDeposited(address indexed owner, address indexed tokenAddress, uint256 amount);
    event AssetWithdrawn(address indexed owner, address indexed tokenAddress, uint256 amount);
    
    modifier onlyWillOwner() {
        require(hasWill[msg.sender] && wills[msg.sender].owner == msg.sender);
        _;
    }
    
    modifier willExists(address owner) {
        require(hasWill[owner]);
        _;
    }
    
    modifier willActive(address owner) {
        require(wills[owner].status == WillStatus.Active);
        _;
    }

    constructor() Ownable(msg.sender) {}
    
    function createWill(
        bytes32 _overridePassword,
        string memory _message,
        address payable[] memory _beneficiaryAddresses,
        uint256[] memory _percentages,
        string[] memory _beneficiaryNames,
        string[] memory _beneficiaryEmails
    ) external payable {
        require(_beneficiaryAddresses.length > 0 && _beneficiaryAddresses.length <= MAX_BENEFICIARIES);
        require(_beneficiaryAddresses.length == _percentages.length && _beneficiaryAddresses.length == _beneficiaryNames.length);
        
        uint256 totalPercentage = 0;
        for (uint i; i < _percentages.length; i++) {
            require(_beneficiaryAddresses[i] != address(0) && _percentages[i] > 0);
            totalPercentage += _percentages[i];
        }
        require(totalPercentage == PERCENTAGE_PRECISION);
        
        Will storage newWill = wills[msg.sender];
        newWill.owner = payable(msg.sender);
        newWill.createdAt = block.timestamp;
        newWill.lastCheckIn = block.timestamp;
        newWill.overridePasswordHash = _overridePassword;
        newWill.message = _message;
        newWill.status = WillStatus.Active;
        newWill.isActive = true;
        newWill.totalPercentage = totalPercentage;

        for (uint i; i < _beneficiaryAddresses.length; i++) {
            newWill.beneficiaries.push(Beneficiary({
                beneficiaryAddress: _beneficiaryAddresses[i],
                percentage: _percentages[i],
                name: _beneficiaryNames[i],
                email: _beneficiaryEmails[i],
                claimed: false
            }));
        }
        
        if (msg.value > 0) {
            newWill.assets.push(Asset({
                tokenAddress: address(0),
                amount: msg.value,
                isActive: true
            }));
            emit AssetDeposited(msg.sender, address(0), msg.value);
        }
        
        hasWill[msg.sender] = true;
        willOwners.push(msg.sender);
        willOwnerIndex[msg.sender] = willOwners.length - 1;
        totalWills++;
        activeWills++;
        
        emit WillCreated(msg.sender, totalWills, _beneficiaryAddresses.length, block.timestamp);
    }
    
    function updateWill(
        address payable[] memory _beneficiaryAddresses,
        uint256[] memory _percentages,
        string[] memory _beneficiaryNames,
        string[] memory _beneficiaryEmails,
        string memory _message
    ) external onlyWillOwner willExists(msg.sender) willActive(msg.sender) {
        require(_beneficiaryAddresses.length > 0 && _beneficiaryAddresses.length <= MAX_BENEFICIARIES);
        require(_beneficiaryAddresses.length == _percentages.length && 
                _beneficiaryAddresses.length == _beneficiaryNames.length && 
                _beneficiaryAddresses.length == _beneficiaryEmails.length);
        
        uint256 totalPercentage = 0;
        for (uint i; i < _percentages.length; i++) {
            require(_beneficiaryAddresses[i] != address(0) && _percentages[i] > 0);
            totalPercentage += _percentages[i];
        }
        require(totalPercentage == PERCENTAGE_PRECISION);
        
        Will storage existingWill = wills[msg.sender];
        delete existingWill.beneficiaries;
        
        for (uint i; i < _beneficiaryAddresses.length; i++) {
            existingWill.beneficiaries.push(Beneficiary({
                beneficiaryAddress: _beneficiaryAddresses[i],
                percentage: _percentages[i],
                name: _beneficiaryNames[i],
                email: _beneficiaryEmails[i],
                claimed: false
            }));
        }
        
        existingWill.message = _message;
        existingWill.totalPercentage = totalPercentage;
        emit WillUpdated(msg.sender, block.timestamp);
    }
    
    function checkIn() external onlyWillOwner willExists(msg.sender) willActive(msg.sender) nonReentrant {
        wills[msg.sender].lastCheckIn = block.timestamp;
        emit CheckInPerformed(msg.sender, block.timestamp);
    }
    
    function useOverride(string memory password) external onlyWillOwner {
        Will storage will = wills[msg.sender];
        require(will.status == WillStatus.Executing);
        require(keccak256(abi.encodePacked(password)) == will.overridePasswordHash);
        
        will.status = WillStatus.Active;
        will.lastCheckIn = block.timestamp;
        will.executionTime = 0;
        activeWills++;
        emit OverrideUsed(msg.sender, block.timestamp);
    }
    
    function depositEth() public payable onlyWillOwner willActive(msg.sender) {
        require(msg.value > 0);
        Will storage will = wills[msg.sender];
        bool found = false;
        
        for (uint i; i < will.assets.length; i++) {
            if (will.assets[i].tokenAddress == address(0) && will.assets[i].isActive) {
                will.assets[i].amount += msg.value;
                found = true;
                break;
            }
        }
        
        if (!found) {
            will.assets.push(Asset({
                tokenAddress: address(0),
                amount: msg.value,
                isActive: true
            }));
        }
        emit AssetDeposited(msg.sender, address(0), msg.value);
    }
    
    function depositToken(address tokenAddress, uint256 amount) external onlyWillOwner willActive(msg.sender) {
        require(amount > 0);
        
        if (tokenAddress == address(0)) {
            depositEth();
            return;
        }
        
        IERC20(tokenAddress).safeTransferFrom(msg.sender, address(this), amount);
        
        Will storage will = wills[msg.sender];
        bool found = false;
        
        for (uint i = 0; i < will.assets.length; i++) {
            if (will.assets[i].tokenAddress == tokenAddress && will.assets[i].isActive) {
                will.assets[i].amount += amount;
                found = true;
                break;
            }
        }
        
        if (!found) {
            will.assets.push(Asset({
                tokenAddress: tokenAddress,
                amount: amount,
                isActive: true
            }));
        }
        emit AssetDeposited(msg.sender, tokenAddress, amount);
    }
    
    function withdrawAsset(address tokenAddress, uint256 amount) external onlyWillOwner willActive(msg.sender) nonReentrant {
        require(amount > 0);
        Will storage will = wills[msg.sender];
        bool found = false;
        
        for (uint i = 0; i < will.assets.length; i++) {
            if (will.assets[i].tokenAddress == tokenAddress && will.assets[i].isActive) {
                require(will.assets[i].amount >= amount);
                will.assets[i].amount -= amount;
                found = true;
                break;
            }
        }
        require(found);
        
        if (tokenAddress == address(0)) {
            will.owner.transfer(amount);
        } else {
            IERC20(tokenAddress).safeTransfer(will.owner, amount);
        }
        emit AssetWithdrawn(msg.sender, tokenAddress, amount);
    }
    
    function startExecution() external {
        uint256 processedCount = 0;
        
        for (uint256 i = 0; i < willOwners.length; i++) {
            address willOwner = willOwners[i];
            Will storage will = wills[willOwner];
            
            if (!hasWill[willOwner] || will.status != WillStatus.Active) continue;
            
            if (block.timestamp >= will.lastCheckIn + EXECUTION_TRIGGER) {
                will.status = WillStatus.Executing;
                will.executionTime = block.timestamp;
                activeWills--;
                processedCount++;
                
                emit DeathTriggered(willOwner, block.timestamp);
                emit ExecutionStarted(willOwner, block.timestamp);
            }
        }
        require(processedCount > 0);
    }
    
    function startExecutionForWill(address willOwner) external willExists(willOwner) {
        Will storage will = wills[willOwner];
        require(will.status == WillStatus.Active);
        require(block.timestamp >= will.lastCheckIn + EXECUTION_TRIGGER);
        
        will.status = WillStatus.Executing;
        will.executionTime = block.timestamp;
        activeWills--;
        
        emit DeathTriggered(willOwner, block.timestamp);
        emit ExecutionStarted(willOwner, block.timestamp);
    }
    
    function claimInheritance(address willOwner) external nonReentrant willExists(willOwner) {
        Will storage will = wills[willOwner];
        require(will.status == WillStatus.Executing);
        
        uint256 beneficiaryIndex = type(uint256).max;
        for (uint i = 0; i < will.beneficiaries.length; i++) {
            if (will.beneficiaries[i].beneficiaryAddress == msg.sender) {
                beneficiaryIndex = i;
                break;
            }
        }
        require(beneficiaryIndex != type(uint256).max);
        require(!will.beneficiaries[beneficiaryIndex].claimed);
        
        Beneficiary storage beneficiary = will.beneficiaries[beneficiaryIndex];
        beneficiary.claimed = true;
        
        uint256 ethAmount = 0;
        address[] memory tokenAddresses = new address[](will.assets.length);
        uint256[] memory tokenAmounts = new uint256[](will.assets.length);
        uint256 tokenCount = 0;
        
        for (uint i = 0; i < will.assets.length; i++) {
            if (!will.assets[i].isActive || will.assets[i].amount == 0) continue;
            
            uint256 inheritanceAmount = (will.assets[i].amount * beneficiary.percentage) / PERCENTAGE_PRECISION;
            if (inheritanceAmount > 0) {
                if (will.assets[i].tokenAddress == address(0)) {
                    ethAmount = inheritanceAmount;
                    payable(msg.sender).transfer(inheritanceAmount);
                } else {
                    tokenAddresses[tokenCount] = will.assets[i].tokenAddress;
                    tokenAmounts[tokenCount] = inheritanceAmount;
                    tokenCount++;
                    IERC20(will.assets[i].tokenAddress).safeTransfer(msg.sender, inheritanceAmount);
                }
            }
        }
        
        assembly {
            mstore(tokenAddresses, tokenCount)
            mstore(tokenAmounts, tokenCount)
        }
        
        emit BeneficiaryClaimed(willOwner, msg.sender, ethAmount, tokenAddresses, tokenAmounts);
        
        bool allClaimed = true;
        for (uint i = 0; i < will.beneficiaries.length; i++) {
            if (!will.beneficiaries[i].claimed) {
                allClaimed = false;
                break;
            }
        }
        
        if (allClaimed) {
            will.status = WillStatus.Completed;
            executedWills++;
            emit WillCompleted(willOwner, block.timestamp);
        }
    }
    
    function cancelWill() external onlyWillOwner nonReentrant {
        Will storage will = wills[msg.sender];
        require(will.status == WillStatus.Active);
        
        will.status = WillStatus.Cancelled;
        will.isActive = false;
        activeWills--;

        uint256 indexToRemove = willOwnerIndex[msg.sender];
        uint256 lastIndex = willOwners.length - 1;
        
        if (indexToRemove != lastIndex) {
            address lastWillOwner = willOwners[lastIndex];
            willOwners[indexToRemove] = lastWillOwner;
            willOwnerIndex[lastWillOwner] = indexToRemove;
        }
        
        willOwners.pop();
        delete willOwnerIndex[msg.sender];

        for (uint i; i < will.assets.length; i++) {
            if (!will.assets[i].isActive || will.assets[i].amount == 0) continue;
            if (will.assets[i].tokenAddress == address(0)) {
                will.owner.transfer(will.assets[i].amount);
            } else {
                IERC20(will.assets[i].tokenAddress).safeTransfer(will.owner, will.assets[i].amount);
            }
            will.assets[i].amount = 0;
            will.assets[i].isActive = false;
        }
        emit WillCancelled(msg.sender, block.timestamp);
    }
    
    function getWill(address owner) external view returns (
        address willOwner,
        uint256 createdAt,
        uint256 lastCheckIn,
        uint256 executionTime,
        string memory message,
        uint256 beneficiaryCount,
        uint256 assetCount,
        WillStatus status,
        bool isActive0
    ) {
        require(hasWill[owner]);
        Will storage will = wills[owner];
        return (
            will.owner,
            will.createdAt,
            will.lastCheckIn,
            will.executionTime,
            will.message,
            will.beneficiaries.length,
            will.assets.length,
            will.status,
            will.isActive
        );
    }
    
    function getBeneficiaries(address owner) external view returns (
        address[] memory addresses,
        uint256[] memory percentages,
        string[] memory names,
        string[] memory emails,
        bool[] memory claimed
    ) {
        require(hasWill[owner]);
        Will storage will = wills[owner];
        uint256 length = will.beneficiaries.length;
        
        addresses = new address[](length);
        percentages = new uint256[](length);
        names = new string[](length);
        emails = new string[](length);
        claimed = new bool[](length);
        
        for (uint i = 0; i < length; i++) {
            addresses[i] = will.beneficiaries[i].beneficiaryAddress;
            percentages[i] = will.beneficiaries[i].percentage;
            names[i] = will.beneficiaries[i].name;
            emails[i] = will.beneficiaries[i].email;
            claimed[i] = will.beneficiaries[i].claimed;
        }
    }
    
    function getAssets(address owner) external view returns (
        address[] memory tokenAddresses,
        uint256[] memory amounts,
        bool[] memory isActive
    ) {
        require(hasWill[owner]);
        Will storage will = wills[owner];
        uint256 length = will.assets.length;
        
        tokenAddresses = new address[](length);
        amounts = new uint256[](length);
        isActive = new bool[](length);
        
        for (uint i = 0; i < length; i++) {
            tokenAddresses[i] = will.assets[i].tokenAddress;
            amounts[i] = will.assets[i].amount;
            isActive[i] = will.assets[i].isActive;
        }
    }
    
    function canTriggerDeath(address owner) external view returns (bool canTrigger) {
        if (!hasWill[owner]) return false;
        Will storage will = wills[owner];
        if (will.status != WillStatus.Active) return false;
        return block.timestamp >= will.lastCheckIn + EXECUTION_TRIGGER;
    }
    
    function getTimeUntilTrigger(address owner) external view returns (uint256) {
        require(hasWill[owner]);
        Will storage will = wills[owner];
        if (will.status != WillStatus.Active) return 0;
        uint256 triggerTime = will.lastCheckIn + EXECUTION_TRIGGER;
        if (block.timestamp >= triggerTime) return 0;
        return triggerTime - block.timestamp;
    }
    
    function getStats() external view returns (uint256 _totalWills, uint256 _activeWills, uint256 _executedWills) {
        return (totalWills, activeWills, executedWills);
    }
    
    function getTotalWillOwners() external view returns (uint256) {
        return willOwners.length;
    }
    
    function getWillOwnerAtIndex(uint256 index) external view returns (address) {
        require(index < willOwners.length);
        return willOwners[index];
    }
    
    function getAllWillOwners() external view returns (address[] memory) {
        return willOwners;
    }
    
    receive() external payable {}
}