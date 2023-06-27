const person = {
  id: 2,
  gender: "male",
};

const student = {
  name: "Ravi",
  email: "ravi11@yopmail.com",
};

const combinedObject = {
  ...person,
  ...student,
};

console.log(combinedObject);
