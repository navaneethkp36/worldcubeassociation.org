import React, { useState, useCallback } from 'react';
import { Form } from 'semantic-ui-react';
import _ from 'lodash';
import { DNF_KEYS, DNS_KEYS } from './keybindings';
import {
  SKIPPED_VALUE,
  DNF_VALUE,
  DNS_VALUE,
} from '../../../../lib/wca-live/attempts';

function numberToInput(number) {
  if (number === SKIPPED_VALUE) return '';
  if (number === DNF_VALUE) return 'DNF';
  if (number === DNS_VALUE) return 'DNS';
  return number.toString();
}

/* eslint react/jsx-props-no-spreading: "off" */
function FmField({
  value, onChange, label, disabled, TextFieldProps = {},
}) {
  const [prevValue, setPrevValue] = useState(value);
  const [draftValue, setDraftValue] = useState(value);

  // Sync draft value when the upstream value changes.
  // See AttemptResultField for detailed description.
  if (prevValue !== value) {
    setDraftValue(value);
    setPrevValue(value);
  }

  const handleChange = useCallback((event) => {
    const key = event.nativeEvent.data;
    if (DNF_KEYS.includes(key)) {
      setDraftValue(DNF_VALUE);
    } else if (DNS_KEYS.includes(key)) {
      setDraftValue(DNS_VALUE);
    } else {
      const newValue = _.toInteger(event.target.value.replace(/\D/g, '')) || SKIPPED_VALUE;
      setDraftValue(newValue);
    }
  }, [setDraftValue]);

  const handleBlur = useCallback(() => {
    onChange(draftValue);
    // Once we emit the change, reflect the initial state.
    setDraftValue(value);
  }, [onChange, draftValue, setDraftValue, value]);

  return (
    <Form.Input
      {...TextFieldProps}
      label={label}
      disabled={disabled}
      spellCheck={false}
      value={numberToInput(draftValue)}
      onChange={handleChange}
      onBlur={handleBlur}
    />
  );
}

export default FmField;
