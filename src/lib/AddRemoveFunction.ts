export interface AddRemoveFunction {
    add: (checked: string) => void;
    remove: (checked: string) => void;
}

export function toggleBorder(checkboxEvent: React.ChangeEvent<HTMLInputElement>, identity: string, addRemoveFunc: AddRemoveFunction, 
    setBorderColor: React.Dispatch<React.SetStateAction<string>>) {
    const checkbox = checkboxEvent.target;
    if (checkbox.checked) {
      setBorderColor('border-blue-500');
      addRemoveFunc.add(identity);
    } else {
      setBorderColor('border-gray-100');
      addRemoveFunc.remove(identity);
    }
  }