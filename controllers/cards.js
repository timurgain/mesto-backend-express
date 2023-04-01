const { constants } = require('http2');
const CardModel = require('../models/card');
const { customCastErrorId } = require('./castomErrors');

function handleError(res, err) {
  if (err.name === 'ValidationError') {
    res
      .status(constants.HTTP_STATUS_BAD_REQUEST)
      .send({ message: 'Переданы некорректные данные полей карточки.' });
    return;
  }
  if (err.name === 'CastError' && err.path === 'owner') {
    res
      .status(constants.HTTP_STATUS_BAD_REQUEST)
      .send({ message: 'Ошибка удаления карточки.' });
    return;
  }
  if (err.name === 'CastError' && err.path === '_id') {
    res
      .status(constants.HTTP_STATUS_NOT_FOUND)
      .send({ message: 'Карточка с указанным _id не найдена.' });
    return;
  }
  res
    .status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
    .send({ message: 'Произошла ошибка на сервере.' });
}

function getCards(req, res) {
  CardModel.find({})
    .populate('owner likes')
    .then((queryObj) => res.send(queryObj))
    .catch((err) => handleError(res, err));
}

function postCard(req, res) {
  const { name, link } = req.body;
  const owner = req.user._id;
  CardModel.create({ name, link, owner })
    .then((queryObj) => res.status(constants.HTTP_STATUS_CREATED).send(queryObj))
    .catch((err) => handleError(res, err));
}

function deleteCard(req, res) {
  CardModel.findOneAndDelete({ _id: req.params.cardId, owner: req.user._id })
    .populate('owner likes')
    .then((queryObj) => res.status(constants.HTTP_STATUS_NO_CONTENT).send(queryObj))
    .catch((err) => handleError(res, err));
}

function putCardLike(req, res) {
  CardModel.findOneAndUpdate(
    { _id: req.params.cardId },
    { $addToSet: { likes: req.user._id } },
    { returnDocument: 'after' },
  )
    .populate('owner likes')
    .then((queryObj) => {
      if (!queryObj) throw customCastErrorId;
      res.send(queryObj);
    })
    .catch((err) => handleError(res, err));
}

function removeCardLike(req, res) {
  CardModel.findByIdAndUpdate(
    { _id: req.params.cardId },
    { $pull: { likes: req.user._id } },
    { returnDocument: 'after' },
  )
    .populate('owner likes')
    .then((queryObj) => {
      if (!queryObj) throw customCastErrorId;
      res.send(queryObj);
    })
    .catch((err) => handleError(res, err));
}

module.exports = {
  getCards,
  postCard,
  deleteCard,
  putCardLike,
  removeCardLike,
};
