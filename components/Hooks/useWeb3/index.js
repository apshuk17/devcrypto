import { useContext } from 'react';
import { Web3Context } from '@components/providers';

const useWeb3 = () => {
    return useContext(Web3Context);
};

export default useWeb3;