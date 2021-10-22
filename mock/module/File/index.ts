const file = [
  {
    url: '/api/upload',
    methods: 'post',
    response: (options: { body: Record<string, any> }) => {
      const { body } = options;
      return body.file;
    }
  }
];

export default file;
