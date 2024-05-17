'use client';

import { useEffect, useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Search from '@/app/ui/dashboard/search';
import { getHotelData, searchHotelData } from '@/client/api';
import Select from 'react-select';
import { debounce } from 'lodash';

const columns: GridColDef[] = [
  { field: 'Name', headerName: 'Name', width: 500 },
  { field: 'Address', headerName: 'Address', width: 250 },
  { field: 'CityName', headerName: 'City Name', width: 200 },
  { field: 'Rating', headerName: 'Rating', width: 150 },
];

const crimeRateOption = [
  { value: 2, label: 'Default' },
  { value: 1, label: 'Safe' },
  { value: 0, label: 'Very Safe' },
];

const livingWageOption = [
  { value: 2, label: 'Default' },
  { value: 1, label: 'Medium' },
  { value: 0, label: 'Low' },
];

const precipitationOption = [
  { value: 2, label: 'Default' },
  { value: 1, label: 'Moderate' },
  { value: 0, label: 'Dry' },
];

export default function DataTable() {
  const [rows, setRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLivingWageOption, setSelectedLivingWageOption] = useState(livingWageOption[0]);
  const [selectedCrimeRateOption, setSelectedCrimeRateOption] = useState(crimeRateOption[0]);
  const [selectedPrecipitationOption, setSelectedPrecipitationOption] = useState(precipitationOption[0]);


  useEffect(() => {
    searchHotelData(searchTerm, selectedLivingWageOption, selectedCrimeRateOption, selectedPrecipitationOption).then(data => {
      if (data) {
        // console.log(data);
        const mappedData = data.map((item: any) => ({
          Name: item['Name'],
          Address: item['Address'],
          CityName: item['CityName'],
          Rating: Math.round(item['Rating'] * 10) / 10,
        }));
        // console.log(mappedData);
        setRows(mappedData);
      }
    });
  }, []);


  // 0420 kuock0129// Update the search term when the user types in the search box
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };
  
  const debouncedSearch = debounce(() => {
    searchHotelData(searchTerm, selectedLivingWageOption, selectedCrimeRateOption, selectedPrecipitationOption).then(data => {
      if (data) {
        const mappedData = data.map((item: any) => ({
          Name: item['Name'],
          Address: item['Address'],
          CityName: item['CityName'],
          Rating: Math.round(item['Rating'] * 10) / 10,
        }));
        setRows(mappedData);
      }
    });
  }, 1000);
  
  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent the default form submit action
    debouncedSearch();
  };
  // Update the search term when the user types in the search box

  const handleLivingWageChange = (selectedOption: any) => {
    setSelectedLivingWageOption(selectedOption);
  };

  const handleCrimeRateChange = (selectedOption: any) => {
    setSelectedCrimeRateOption(selectedOption);
  };

  const handlePrecipitationChange = (selectedOption: any) => {
    setSelectedPrecipitationOption(selectedOption);
  };

  const handleRowClick = (params: { row: { Name: string | number | boolean; CityName: string | number | boolean; }; }) => {
    const hotelName = encodeURIComponent(params.row.Name);
    const cityName = encodeURIComponent(params.row.CityName);
    const path = `/dashboard/reviews?hotel=${hotelName}&city=${cityName}`;
    window.location.href = path;
  };


  return (
    <div style={{ width: '100%' }}>

      <Search
        placeholder="Search hotels..."
        value={searchTerm}
        onChange={handleSearchChange}
        onSubmit={handleSearch}
      />


      <div style={{ height: '10px' }} />

      <div style={{ display: 'flex', justifyContent: 'flex-start', gap: '10px', marginBottom: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', width: '250px' }}>
          <label htmlFor="living-wage-select" style={{ marginRight: '10px' }}>Living Wage: </label>
          <Select
            options={livingWageOption}
            value={selectedLivingWageOption}
            onChange={handleLivingWageChange}
            isSearchable={false}
            isClearable={false}
            instanceId="living-wage-select"
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', width: '250px' }}>
          <label htmlFor="precipitation-select" style={{ marginRight: '10px' }}>Precipitation</label>
          <Select
            options={precipitationOption}
            value={selectedPrecipitationOption}
            onChange={handlePrecipitationChange}
            isSearchable={false}
            isClearable={false}
            instanceId="precipitation-select"
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', width: '400px' }}>
          <label htmlFor="crime-rate-select" style={{ marginRight: '10px' }}>Crime Rate</label>
          <Select
            options={crimeRateOption}
            value={selectedCrimeRateOption}
            onChange={handleCrimeRateChange}
            isSearchable={false}
            isClearable={false}
            instanceId="crime-rate-select"
          />
        </div>
      </div>
      <DataGrid
        className="cursor-pointer"
        rows={rows}
        columns={columns}
        getRowId={(row) => `${row.Name}-${row.CityName}`}
        onRowClick={handleRowClick}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10]}
      />
    </div>
  );
}