const { body } = require("express-validator");

exports.validateNotificationBody = () => {
  const criterias = [
    body("notification_type").notEmpty().isString(),
    body("notification").notEmpty().isString(),
    body("notify_to").notEmpty().isString(),
    body("notify_by").notEmpty().isString(),
    body("link").notEmpty().isString(),
  ];

  return criterias;
};
