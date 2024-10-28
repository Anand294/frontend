import { useEffect, useState } from 'react';
import { url } from '../common/commonrequest';

function useMisc() {
  const [miscIdToNameMap, setMiscIdToNameMap] = useState({});
  const [miscList, setMiscList] = useState([]);

  useEffect(() => {
    fetch(`${url}/misc`)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        const idToNameMap = {};
        data.forEach(misc => {
          idToNameMap[misc.misc_id] = misc.misc_name; // Adjust the property name if needed
        });
        setMiscIdToNameMap(idToNameMap);
        setMiscList(data);
        console.log(miscList);
      })
      .catch(err => {
        console.error('Error fetching misc data:', err);
      });
  }, []);

  return { miscIdToNameMap, miscList };
}

export { useMisc };
