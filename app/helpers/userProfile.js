const _ = require("lodash");
const DEFAULT_PROFILE = require("../const/index");

exports.profileColor = () => {
  const randomNumber = _.random(0, 10);
  const randomColor = _.filter(DEFAULT_PROFILE.COLORS, (_item, index) => {
    return index === randomNumber;
  });

  return randomColor[0];
};

exports.capitalizeName = (name) => {
  if (name) {
    const separatedWord = name.split(" ");

    for (let i = 0; i < separatedWord.length; i++) {
      separatedWord[i] =
        separatedWord[i].charAt(0).toUpperCase() +
        separatedWord[i].slice(1).toLowerCase();
    }

    return separatedWord.join(" ");
  }
};

exports.getInitials = (firstname, lastname) => {
  if (firstname && lastname) {
    return firstname.charAt(0).toUpperCase() + lastname.charAt(0).toUpperCase();
  }
};
