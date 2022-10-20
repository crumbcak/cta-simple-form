import classnames from "classnames";
import {
  ComponentProps,
  FC,
  FormEventHandler,
  PropsWithChildren,
  useEffect,
  useState,
} from "react";

import "./Form.scss";

const FieldSet: FC<PropsWithChildren<{ label?: string; error?: string }>> = ({
  label,
  children,
  error,
}) => (
  <fieldset>
    <div className="labelWrapper">
      {label && <label>{label}</label>}
      {error && <span className="fieldError">{error}</span>}
    </div>
    {children}
  </fieldset>
);

interface TextInputProps extends Omit<ComponentProps<"input">, "onChange"> {
  name: string;
  placeholder?: string;
  initialValue?: string;
  onChange?: (data?: string) => void;
  label: string;
}

const TextInput: FC<TextInputProps> = ({
  initialValue,
  onChange,
  label,
  ...props
}) => {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState<string>();

  useEffect(() => {
    if (value?.length && error) {
      setError(undefined);
    }

    if (onChange) {
      onChange(value);
    }
  }, [value]);

  return (
    <FieldSet label={label} error={error}>
      <input
        {...props}
        onBlur={() => {
          if (!value?.length) {
            setError("Field is required");
          }
        }}
        value={value}
        onChange={(e) => {
          const val = e.target.value;
          console.log(val);
          setValue(val);
        }}
      />
    </FieldSet>
  );
};

interface RadioInputProps {
  text: string;
  selected: boolean;
  onClick: () => void;
}
const RadioInput: FC<RadioInputProps> = ({ text, selected, onClick }) => (
  <div className="radioInput" onClick={onClick}>
    <span className={classnames("radioBox", { selected })}></span>
    <span className="radioLabel">{text}</span>
  </div>
);

interface RadioFieldProps {
  options: Record<string, string>;
  label: string;
  onChange: (value?: string) => void;
}

const RadioField: FC<RadioFieldProps> = ({ options, label, onChange }) => {
  const [value, setValue] = useState<string>();
  useEffect(() => {
    if (onChange) {
      onChange(value);
    }
  }, [value]);
  return (
    <FieldSet label={label}>
      {Object.entries(options).map(([key, text]) => (
        <RadioInput
          selected={key === value}
          text={text}
          onClick={() => {
            setValue(key);
          }}
        />
      ))}
    </FieldSet>
  );
};

interface FormData {
  someText?: string;
  someRadio?: string;
}

export const Form: FC = () => {
  const [formData, setFormData] = useState<FormData>({});
  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    console.log(formData);
    if (!formData.someText || !formData.someRadio) {
      return;
    }
    console.log(formData);
    alert(`
      someText: ${formData.someText}
      someRadio: ${formData.someRadio}
    `);
  };
  return (
    <div id="Form">
      <form onSubmit={handleSubmit}>
        <TextInput
          name="someText"
          label="Enter Some Text"
          placeholder="Enter some text"
          onChange={(input) =>
            setFormData((state) => ({
              ...state,
              someText: input?.length ? input : undefined,
            }))
          }
        />
        <RadioField
          label="Choose one option"
          options={{
            foo: "Foo",
            bar: "Bar",
            baz: "Baz",
          }}
          onChange={(input) =>
            setFormData((state) => ({
              ...state,
              someRadio: input?.length ? input : undefined,
            }))
          }
        />
        <button className="submit" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
};
