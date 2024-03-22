export type AddRemoveFunction = {
  add: (checked: string) => void;
  remove: (checked: string) => void;
  checkPrinted: (identity :string) => void;
};

export type ParentActionFunction = (
  checkboxEvent: React.ChangeEvent<HTMLInputElement>,
  identity: string,
  AddRemoveBorderColor: AddRemoveBorderColor
) => void;

export type AddRemoveBorderColor = {
  addRemoveFunc: AddRemoveFunction;
  setBorderColor: React.Dispatch<React.SetStateAction<string>>;
 };

 export type ParentActionWithBorderChange = {
  toggleBorder: ParentActionFunction;
  addRemoveBorderColor: AddRemoveBorderColor
 }

 export const toggleBorder: ParentActionFunction = (checkboxEvent, identity, addRemoveBorderColor) => {
    const checkbox = checkboxEvent.target;
    if (checkbox.checked) {
      addRemoveBorderColor.setBorderColor('border-blue-500');
      addRemoveBorderColor.addRemoveFunc.add(identity);
    } else {
      addRemoveBorderColor.setBorderColor('border-gray-100');
      addRemoveBorderColor.addRemoveFunc.remove(identity);
    }
  }