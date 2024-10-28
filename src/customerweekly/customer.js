import { useEffect, useState } from 'react';
import { url } from '../common/commonrequest';

function useCustomers() {
  const [customerIdToNameMap, setCustomerIdToNameMap] = useState({});
  const [customersList, setCustomersList] = useState([]);

  useEffect(() => {
    fetch(`${url}/customer`)
      .then(response => response.json())
      .then(data => {
        const idToNameMap = {};
        data.forEach(customer => {
          idToNameMap[customer.customer_id] = customer.customer_name;
        });
        setCustomerIdToNameMap(idToNameMap);
        setCustomersList(data);
      })
      .catch(err => {
        console.error('Error fetching customers:', err);
      });
  }, []);

  return { customerIdToNameMap, customersList };
}

export {useCustomers};
