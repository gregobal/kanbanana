export default {
  Mutation: {
    setLoading: (root, { value }, { cache }) => {
      const data = {
        loading: value,
      };
      cache.writeData({ data })
    },
    setError: (root, { value }, { cache }) => {
      const data = {
        error: value,
      };
      cache.writeData({ data })
    },
    setIsAuth: (root, { value }, { cache }) => {
      const data = {
        isAuth: value,
      };
      cache.writeData({ data })
    },
  },
}
