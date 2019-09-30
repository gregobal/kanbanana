export default cache => {
  const data = {
    loading: false,
    error: null,
    isAuth: false
  };
  cache.writeData({ data })
}
