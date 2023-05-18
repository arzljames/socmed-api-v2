const router = require("express").Router();
const notificationController = require("../controllers/notification.controller");
const authenticationValidation = require("../middlewares/authenticationValidation");
const notificationValidation = require("../middlewares/notificationValidation");

/**
 * @api {POST}  Create new notification
 *
 * @param  {String} [username] Username
 * @param  {String} [password] Password
 */
router.post(
  "/",
  [
    authenticationValidation.validateToken,
    notificationValidation.validateNotificationBody(),
  ],
  notificationController.createNotification
);

/**
 * @api {GET} - Get list of notifications
 *
 */
router.get(
  "/",
  authenticationValidation.validateToken,
  notificationController.getNotifications
);

/**
 * @api {DELETE} - Delete spicific notification
 *
 */
router.delete(
  "/delete-react-notification/:notify_by/:post_id",
  authenticationValidation.validateToken,
  notificationController.undoReactNotification
);

/**
 * @api {PUT} - Mark notification as read

 */
router.put(
  "/:notification_id",
  authenticationValidation.validateToken,
  notificationController.markReadNotification
);

router.put(
  "/update/mark-all-read",
  authenticationValidation.validateToken,
  notificationController.markAllRead
);

router.put(
  "/:id/update",
  [
    authenticationValidation.validateToken,
    notificationValidation.validateStatus(),
  ],
  notificationController.updateNotification
);

router.delete(
  "/:id/delete",
  authenticationValidation.validateToken,
  notificationController.deleteNotification
);

module.exports = router;
