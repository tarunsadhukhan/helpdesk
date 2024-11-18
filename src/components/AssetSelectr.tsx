import React from 'react';
import Select from 'react-select';
import { Control, Controller } from 'react-hook-form';
import { Asset } from '../types';

interface AssetSelectProps {
  control: Control<any>;
  assets: Asset[];
  disabled?: boolean;
  error?: string;
}

interface OptionType {
  value: string;
  label: string;
  description?: string;
}

const AssetSelect = ({ control, assets, disabled = false, error }: AssetSelectProps) => {
  const options: OptionType[] = assets.map(asset => ({
    value: asset.id,
    label: asset.codename,
    description: asset.description
  }));

  const customStyles = {
    control: (base: any, state: any) => ({
      ...base,
      minHeight: '42px',
      background: disabled ? '#F3F4F6' : 'white',
      borderColor: error ? '#EF4444' : state.isFocused ? '#00A3C4' : '#E5E7EB',
      boxShadow: 'none',
      '&:hover': {
        borderColor: state.isFocused ? '#00A3C4' : '#E5E7EB'
      }
    }),
    valueContainer: (base: any) => ({
      ...base,
      padding: '2px 12px'
    }),
    option: (base: any, state: any) => ({
      ...base,
      backgroundColor: state.isSelected ? '#00A3C4' : state.isFocused ? '#E6F7FA' : 'white',
      color: state.isSelected ? 'white' : '#374151',
      cursor: 'pointer',
      ':active': {
        backgroundColor: '#00A3C4'
      }
    }),
    input: (base: any) => ({
      ...base,
      color: '#374151',
      margin: 0,
      padding: 0
    }),
    placeholder: (base: any) => ({
      ...base,
      color: '#9CA3AF'
    }),
    singleValue: (base: any) => ({
      ...base,
      color: '#374151'
    }),
    dropdownIndicator: (base: any) => ({
      ...base,
      padding: '8px',
      color: '#9CA3AF',
      ':hover': {
        color: '#00A3C4'
      }
    }),
    clearIndicator: (base: any) => ({
      ...base,
      padding: '8px',
      color: '#9CA3AF',
      ':hover': {
        color: '#EF4444'
      }
    }),
    menu: (base: any) => ({
      ...base,
      marginTop: '4px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
    })
  };

  const CustomOption = ({ children, ...props }: any) => {
    const { description } = props.data;
    return (
      <div
        {...props.innerProps}
        className={`px-3 py-2 ${
          props.isFocused ? 'bg-[#E6F7FA]' : 'bg-white'
        } ${props.isSelected ? 'bg-[#00A3C4] text-white' : ''} cursor-pointer`}
      >
        <div className="font-medium">{children}</div>
        {description && (
          <div className={`text-sm ${props.isSelected ? 'text-white/80' : 'text-gray-500'}`}>
            {description}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-1">
      <Controller
        name="asset"
        control={control}
        render={({ field: { onChange, value, ref } }) => (
          <Select
            ref={ref}
            options={options}
            isDisabled={disabled}
            value={options.find(option => option.value === value) || null}
            onChange={(option) => onChange(option ? option.value : '')}
            styles={customStyles}
            isClearable
            isSearchable
            placeholder="Search and select asset"
            noOptionsMessage={() => "No assets found"}
            components={{
              Option: CustomOption,
              IndicatorSeparator: () => null
            }}
            classNames={{
              control: () => 'border rounded-md',
              input: () => 'text-sm',
              option: () => 'text-sm',
              placeholder: () => 'text-sm',
              singleValue: () => 'text-sm'
            }}
            theme={(theme) => ({
              ...theme,
              colors: {
                ...theme.colors,
                primary: '#00A3C4',
                primary25: '#E6F7FA',
                danger: '#EF4444',
                neutral20: '#E5E7EB',
                neutral30: '#D1D5DB',
                neutral50: '#9CA3AF',
                neutral80: '#374151'
              },
              spacing: {
                ...theme.spacing,
                baseUnit: 4,
                controlHeight: 42,
                menuGutter: 4
              },
              borderRadius: 6
            })}
          />
        )}
      />
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default AssetSelect;