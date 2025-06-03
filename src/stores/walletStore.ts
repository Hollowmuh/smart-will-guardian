
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import detectEthereumProvider from '@metamask/detect-provider';
import { BrowserProvider, JsonRpcSigner } from 'ethers';
import { WalletState, User } from '../types';

interface WalletStore extends WalletState {
  user: User | null;
  signer: JsonRpcSigner | null;
  error: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  switchNetwork: (chainId: string) => Promise<void>;
  authenticate: () => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

export const useWalletStore = create<WalletStore>()(
  persist(
    (set, get) => ({
      address: null,
      chainId: null,
      isConnected: false,
      isConnecting: false,
      provider: null,
      user: null,
      signer: null,
      error: null,

      connectWallet: async () => {
        try {
          set({ isConnecting: true, error: null });
          
          const provider = await detectEthereumProvider();
          if (!provider) {
            throw new Error('Please install MetaMask or another Web3 wallet');
          }

          const ethersProvider = new BrowserProvider(provider);
          const accounts = await ethersProvider.send('eth_requestAccounts', []);
          
          if (accounts.length === 0) {
            throw new Error('No accounts found');
          }

          const network = await ethersProvider.getNetwork();
          const signer = await ethersProvider.getSigner();
          
          set({
            address: accounts[0],
            chainId: Number(network.chainId),
            isConnected: true,
            provider: ethersProvider,
            signer,
            isConnecting: false
          });

          // Set up event listeners
          provider.on('accountsChanged', (accounts: string[]) => {
            if (accounts.length === 0) {
              get().disconnectWallet();
            } else {
              set({ address: accounts[0] });
            }
          });

          provider.on('chainChanged', (chainId: string) => {
            set({ chainId: parseInt(chainId, 16) });
          });

        } catch (error: any) {
          set({ 
            error: error.message || 'Failed to connect wallet',
            isConnecting: false
          });
        }
      },

      disconnectWallet: () => {
        set({
          address: null,
          chainId: null,
          isConnected: false,
          provider: null,
          signer: null,
          user: null
        });
      },

      switchNetwork: async (chainId: string) => {
        try {
          const { provider } = get();
          if (!provider) throw new Error('No provider available');
          
          await provider.send('wallet_switchEthereumChain', [
            { chainId }
          ]);
        } catch (error: any) {
          set({ error: error.message || 'Failed to switch network' });
        }
      },

      authenticate: async () => {
        try {
          const { signer, address } = get();
          if (!signer || !address) {
            throw new Error('Wallet not connected');
          }

          const message = `Sign this message to authenticate with Smart Will.\n\nAddress: ${address}\nTimestamp: ${Date.now()}`;
          const signature = await signer.signMessage(message);
          
          // In a real app, you'd verify this signature on your backend
          set({
            user: {
              address,
              isAuthenticated: true
            }
          });
        } catch (error: any) {
          set({ error: error.message || 'Authentication failed' });
        }
      },

      logout: () => {
        set({ user: null });
      },

      clearError: () => {
        set({ error: null });
      }
    }),
    {
      name: 'wallet-storage',
      partialize: (state) => ({
        address: state.address,
        chainId: state.chainId,
        isConnected: state.isConnected,
        user: state.user
      })
    }
  )
);
