import mongoose from 'mongoose';
// import debug from 'debug';

class Message {
  static createSingleRequest(customerId, productId) {
    const createRequest = {};
    createRequest.customerId = customerId;
    createRequest.productId = [];
    createRequest.productId.push(productId);
    return createRequest;
  }

  static createPurchaseRequests(customerId, productId) {
    const purchaseRequests = [];
    const singleRequest = {};

    singleRequest.customerId = customerId;
    singleRequest.productId = [];
    singleRequest.productId.push(productId);
    purchaseRequests.push(singleRequest);
    return purchaseRequests;
  }

  static findPreviousRequest(singleMessage, customerId) {
    return singleMessage
      .purchaseRequests
      .find((request) => request.customerId.toString() === customerId.toString());
  }

  static artRequest(PostModel, MessageModel) {
    return async (req, res) => {
      try {
        const { id } = req.params;
        const userId = req.user._id;
        const post = await PostModel.findById(id);
        const { authorId } = post;
        const previousMessage = await MessageModel
          .find({ artistId: authorId });
        const [singleMessage] = previousMessage;
        if (previousMessage.length > 0) {
          const previousRequest = Message.findPreviousRequest(singleMessage, userId);
          if (previousRequest !== undefined) {
            if (previousRequest.productId.some((singleProductId) => singleProductId === id)) {
              return res.json('request was previously sent');
            }

            previousRequest.productId.push(id);

            const updatedRequest = singleMessage.purchaseRequests.map((request) => {
              if (request.customerId.toString() === userId.toString()) {
                return previousRequest;
              }
              return request;
            });
            await MessageModel
              .findByIdAndUpdate(singleMessage._id, { purchaseRequests: updatedRequest });
            res.json('request was sent successfully');
          } else {
            const { purchaseRequests } = singleMessage;

            purchaseRequests.push(Message.createSingleRequest(userId, id));
            // eslint-disable-next-line
            await MessageModel.findByIdAndUpdate(singleMessage._id, { purchaseRequests : purchaseRequests});
            return res.json('request was sent successfully');
          }
        } else {
          const purchaseRequests = Message.createPurchaseRequests(userId, id);
          const message = new MessageModel({
            artistId: mongoose.Types.ObjectId(authorId),
            purchaseRequests,
          });

          await message.save();
          return res.json('request was sent successfully');
        }
        return res.json('please try again');
      } catch (error) {
        return res.sendStatus(500);
      }
    };
  }
}

export default Message;
