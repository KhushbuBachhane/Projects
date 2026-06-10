export const initSocket = (io) => {
  io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);

    socket.on('joinAlerts', () => {
      socket.join('alerts');
      console.log(`Client ${socket.id} joined alerts room`);
    });

    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });
};

export const attachIoToRequest = (io) => (req, res, next) => {
  req.io = io;
  next();
};
