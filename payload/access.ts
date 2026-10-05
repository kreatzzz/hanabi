import type { Access, FieldAccess, Where } from "payload";

export const authenticated: Access = ({ req }) => Boolean(req.user);

export const authenticatedField: FieldAccess = ({ req }) => Boolean(req.user);

export const publishedOrAuthenticated: Access = ({ req }) => {
  if (req.user) return true;

  const query: Where = {
    and: [
      {
        _status: {
          equals: "published",
        },
      },
      {
        publishedAt: {
          less_than_equal: new Date().toISOString(),
        },
      },
    ],
  };

  return query;
};
