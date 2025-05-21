import { useState, useEffect } from 'react';
import { Dimensions } from 'react-native';
import { useDispatch } from 'react-redux';
import { setDimentions } from '../redux/action';

const { width, height } = Dimensions.get('window');

const useFetchDimention = () => {

  const [windowSize, setWindowSize] = useState({ width, height });
 const dispatch= useDispatch()

  useEffect(() => {
    const onResize = () => {
      const { width, height } = Dimensions.get('window');

      setWindowSize({ width, height });
      dispatch(setDimentions({width:width, height:height}))
           };
    Dimensions.addEventListener('change', onResize);

  }, []);

 // return { width,height};
};

export default useFetchDimention;