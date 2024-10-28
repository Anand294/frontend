import { useEffect, useState } from 'react';
import { url } from '../common/commonrequest';

function useFunctions() {
  const [functionIdToNameMap, setFunctionIdToNameMap] = useState({});
  const [functionsList, setFunctionsList] = useState([]);

  useEffect(() => {
    fetch(`${url}/function`)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        const idToNameMap = {};
        data.forEach(func => {
          idToNameMap[func.function_id] = func.function_name; // Adjust the property name if needed
        });
        setFunctionIdToNameMap(idToNameMap);
        setFunctionsList(data);
        console.log(functionsList);
      })
      .catch(err => {
        console.error('Error fetching functions:', err);
      });
  }, []);

  return { functionIdToNameMap, functionsList };
}

export { useFunctions };
