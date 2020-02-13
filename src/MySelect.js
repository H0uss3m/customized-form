import React from 'react'
import * as ReactSelect from 'react-select'

const MySelect = props => {
  if (props.allowSelectAll) {
    return (
      <ReactSelect.default
        {...props}
        options={[props.allOption, ...props.options]}
        onChange={selected => {
          if (
            selected !== null &&
            selected.length > 0 &&
            selected[selected.length - 1].value === props.allOption.value
          ) {
            return props.onChange([
              ...selected.flat(2),
              ...props.options.flat(2)
            ])
          }

          return props.onChange(selected)
        }}
      />
    )
  }

  return <ReactSelect.default {...props} />
}
MySelect.defaultProps = {
  allOption: {
    label: 'Sélectionner tout',
    value: '*'
  }
}

export default MySelect
