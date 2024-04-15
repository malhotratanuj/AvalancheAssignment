import React, { useState } from 'react';
import { ethers } from 'ethers';
import PriceFeed from '../src/artifacts/contracts/HelloWorld.sol/PriceFeed.json';
import './App.css';

function App() {
  const [storedPrice, setStoredPrice] = useState('');
  const [selectedPair, setSelectedPair] = useState('');
  const [clickedRadioButtonId, setClickedRadioButtonId] = useState('');

  const contractAddress = '0x872c643956B52f8873f968ed73B2E1d4d83e1023';
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const contract = new ethers.Contract(contractAddress, PriceFeed.abi, provider);

  const getPair = async () => {
    console.log('submit id: ', clickedRadioButtonId);
    try {
      const contractWithSigner = contract.connect(provider.getSigner());
      const transaction = await contractWithSigner.updatePrice(clickedRadioButtonId);
      await transaction.wait();
      const latestFetchedPrice = await contract.getLastFetchedPrice(clickedRadioButtonId);
      setStoredPrice('$' + parseInt(latestFetchedPrice) / 100000000); 
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    setStoredPrice('');
    setSelectedPair(e.target.value);
    setClickedRadioButtonId(e.target.id);
  };

  return (
    <div className='container'>
      <div className='card mt-2 shadow' style={{ width: '32rem', borderRadius: '15px' }}>
        <div className='card-header text-center bg-primary text-white'>
          <hr></hr>
          Conversion Pair
        </div>
        <div className='card-body'>
          <div className='d-flex justify-content-center'>
            <form onSubmit={(e) => e.preventDefault()}>
              <div className='form-group' controlId='pairs'>
                {['BTC/USD', 'ETH/USD', 'LINK/USD', 'BTC/ETH'].map((pair, index) => (
                  <div key={index} style={{ marginRight: '1rem' }}>
                    <input
                      type='radio'
                      id={index + 1}
                      value={pair}
                      checked={selectedPair === pair}
                      onChange={handleChange}
                    />
                    <label htmlFor={index + 1}>{pair}</label>
                  </div>
                ))}
              </div>
            </form>
          </div>
          <div className='mt-4 d-flex justify-content-center'>
            <button className='btn btn-outline-primary btn-sm' onClick={getPair}>
              Submit
            </button>
          </div>
        </div>
        <div className='card-footer'>
          {storedPrice !== '' ? (
            <div className='d-flex justify-content-center'>
              <h5>{selectedPair} ➡ {storedPrice}</h5>
            </div>
          ) : (
            <div style={{ height: '20px' }}></div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
