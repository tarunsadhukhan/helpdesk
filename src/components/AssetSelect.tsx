import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import { Control, Controller } from 'react-hook-form';
import { Asset } from '../types';
import { Search } from 'lucide-react';

interface AssetSelectProps {
  control: Control<any>;
  assets: Asset[];
  disabled?: boolean;
  error?: string;
}

const AssetSelect = ({ control, assets, disabled = false, error }: AssetSelectProps) => {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState('');
  const loading = open && assets.length === 0;

  const filterOptions = (options: Asset[], { inputValue }: { inputValue: string }) => {
    const searchTerm = inputValue.toLowerCase();
    return options.filter(
      option => 
        option.codename.toLowerCase().includes(searchTerm) ||
        (option.description && option.description.toLowerCase().includes(searchTerm))
    );
  };

  return (
    <Controller
      name="asset"
      control={control}
      render={({ field: { onChange, value } }) => (
        <Autocomplete
          id="asset-select"
          open={open}
          onOpen={() => setOpen(true)}
          onClose={() => setOpen(false)}
          disablePortal
          options={assets}
          loading={loading}
          getOptionLabel={(option) => option.codename}
          filterOptions={filterOptions}
          value={assets.find(asset => asset.id === value) || null}
          onChange={(_, newValue) => onChange(newValue ? newValue.id : '')}
          onInputChange={(_, newInputValue) => setInputValue(newInputValue)}
          disabled={disabled}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: '#E5E7EB',
              },
              '&:hover fieldset': {
                borderColor: '#00A3C4',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#00A3C4',
              },
            },
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Asset"
              placeholder="Search and select asset"
              error={!!error}
              helperText={error}
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <React.Fragment>
                    <Search className="w-5 h-5 text-gray-400 mr-2" />
                    {params.InputProps.startAdornment}
                  </React.Fragment>
                ),
                endAdornment: (
                  <React.Fragment>
                    {loading ? (
                      <CircularProgress color="inherit" size={20} />
                    ) : null}
                    {params.InputProps.endAdornment}
                  </React.Fragment>
                ),
              }}
            />
          )}
          renderOption={(props, option) => (
            <li {...props}>
              <div className="flex flex-col py-1">
                <span className="font-medium">{option.codename}</span>
                {option.description && (
                  <span className="text-sm text-gray-500">{option.description}</span>
                )}
              </div>
            </li>
          )}
        />
      )}
    />
  );
};

export default AssetSelect;