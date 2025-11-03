interface ErrorItem {
  champs: string;
  message: string;
}

let getHisError = (errors: ErrorItem[] = [], key: any) => {
  if (errors[0]?.champs == key) {
    return errors[0].message;
  }
  if (errors[1]?.champs == key) {
    return errors[1].message;
  }
  if (errors[2]?.champs == key) {
    return errors[2].message;
  }
  if (errors[3]?.champs == key) {
    return errors[3].message;
  }
  return null;
}

export default { getHisError };