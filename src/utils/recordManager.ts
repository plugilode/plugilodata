import { CompanyRecord } from '../types';

export const getAllRecords = (): CompanyRecord[] => {
  try {
    console.log('Fetching records synchronously...');
    const xhr = new XMLHttpRequest();
    xhr.open('GET', '/api/companies', false); // false makes the request synchronous
    xhr.send();

    if (xhr.status !== 200) {
      console.error('Failed to fetch companies:', xhr.status, xhr.statusText);
      return [];
    }

    const data = JSON.parse(xhr.responseText);
    console.log('Fetched records:', data);
    console.log('Fetched records count:', Array.isArray(data) ? data.length : 'Not an array');
    return Array.isArray(data) ? data as CompanyRecord[] : [];
  } catch (error) {
    console.error('Error fetching companies:', error);
    return [];
  }
};

export const getRecordById = (id: string): CompanyRecord | undefined => {
  try {
    console.log('Fetching record by id synchronously:', id);
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `/api/companies/${id}`, false); // false makes the request synchronous
    xhr.send();

    console.log('XHR status:', xhr.status);
    console.log('XHR response:', xhr.responseText);

    if (xhr.status !== 200) {
      console.error('Failed to fetch company:', xhr.status, xhr.statusText);
      return undefined;
    }

    const data = JSON.parse(xhr.responseText);
    console.log('Fetched record:', data);
    return data as CompanyRecord;
  } catch (error) {
    console.error('Error fetching company:', error);
    return undefined;
  }
};

export const updateRecord = (id: string, updatedData: Partial<CompanyRecord>): boolean => {
  try {
    console.log('Updating record synchronously:', id, updatedData);
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', `/api/companies/${id}`, false); // false makes the request synchronous
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(updatedData));

    if (xhr.status !== 200) {
      console.error('Failed to update company:', xhr.status, xhr.statusText);
      return false;
    }
    return true;
  } catch (error) {
    console.error('Error updating company:', error);
    return false;
  }
};
