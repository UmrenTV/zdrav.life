import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::comment.comment', {
  only: ['find', 'findOne', 'create'],
});
