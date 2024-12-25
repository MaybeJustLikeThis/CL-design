import React, {
  CSSProperties,
  useState,
  useRef,
  FormEvent,
  ReactNode,
  ForwardRefRenderFunction,
  useImperativeHandle,
  forwardRef,
} from "react";
import classNames from "classnames";
import FormContext from "./FormContext";

export interface FormProps extends React.HTMLAttributes<HTMLFormElement> {
  className?: string;
  style?: CSSProperties;
  onFinish?: (values: Record<string, any>) => void; ///表单提交成功后触发回调
  onFinishFailed?: (errors: Record<string, any>) => void; //表单提交失败后触发回调
  initialValues?: Record<string, any>; //初始值
  children?: ReactNode;
}

export interface FormRefApi {
  getFieldsValue: () => Record<string, any>;
  setFieldsValue: (values: Record<string, any>) => void;
}

const Form = forwardRef<FormRefApi, FormProps>((props: FormProps, ref) => {
  const {
    className,
    style,
    children,
    onFinish,
    onFinishFailed,
    initialValues,
    ...others
  } = props;

  const [values, setValues] = useState<Record<string, any>>(
    initialValues || {}
  );

  useImperativeHandle(
    ref,
    () => {
      return {
        getFieldsValue() {
          return values;
        },
        setFieldsValue(fieldValues) {
          setValues({ ...values, ...fieldValues });
        },
      };
    },
    []
  );

  const validatorMap = useRef(new Map<string, Function>()); //用来存储校验规则，不需要重新渲染

  const errors = useRef<Record<string, any>>({}); //用来存储错误信息

  const onValueChange = (key: string, value: any) => {
    values[key] = value;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault(); //阻止默认事件，防止页面刷新

    for (let [key, callbackFunc] of validatorMap.current) {
      if (typeof callbackFunc === "function") {
        errors.current[key] = callbackFunc();
      }
    }

    const errorList = Object.keys(errors.current)
      .map((key) => {
        return errors.current[key];
      })
      .filter(Boolean);

    if (errorList.length) {
      onFinishFailed?.(errors.current);
    } else {
      onFinish?.(values);
    }
  };

  const handleValidateRegister = (name: string, cb: Function) => {
    validatorMap.current.set(name, cb);
  };

  const cls = classNames("ant-form", className);

  return (
    <FormContext.Provider
      value={{
        onValueChange,
        values,
        setValues: (v) => setValues(v),
        validateRegister: handleValidateRegister,
      }}
    >
      <form {...others} className={cls} style={style} onSubmit={handleSubmit}>
        {children}
      </form>
    </FormContext.Provider>
  );
});

export default Form;