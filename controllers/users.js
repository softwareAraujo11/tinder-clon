const getUsers = (req, res) => {
  const users = [
    { name: "pepito perez", email: "pepitoperez123@gmail.com" },
    { name: "pepito perez", email: "pepitoperez123@gmail.com" },
    { name: "pepito perez", email: "pepitoperez123@gmail.com" },
    { name: "pepito perez", email: "pepitoperez123@gmail.com" },
    { name: "pepito perez", email: "pepitoperez123@gmail.com" },
  ];

  res.json(users);
};

module.exports = {
    getUsers
}