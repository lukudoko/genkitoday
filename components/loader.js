import { motion } from 'framer-motion';
import React from 'react';



const Loader = () => {
  const logoVariants = {
    hidden: { pathLength: 0 }, // Start with path hidden (undrawn)
    visible: {
      pathLength: .28,  // Fully drawn path
      transition: {
        duration: 1.8,   // Time it takes to fully draw
        ease: "easeInOut",
        repeat: Infinity,  // Loop infinitely
        repeatType: "reverse"  // Reverse animation to undraw
      },
    },
  };



  return (
    <div
      id="loader"
      className="fixed top-0 left-0 flex w-dvw z-50 h-dvh max-h-dvh bg-teal-400 font-sans items-center justify-center font-semibold text-white flex-col"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
        className="flex items-center justify-center w-96 h-96 flex-col"
      >

        <svg
          viewBox="0 0 504.909 124.467"

        >
          <motion.path
            d="M370.317 12.589c-2.428 2.043-10.806 14.75-18.105 27.46-2.723 4.742-4.078 6.421-4.69 5.811-2.582-2.584-12.012.423-19.86 6.331-8.713 6.561-15.918 17.552-15.936 24.309-.01 3.484 1.73 7.348 3.635 8.079 4.426 1.698 11.234-1.079 17.765-7.246l4.106-3.878-.432 4.076c-.251 2.369-.051 4.789.478 5.776 1.927 3.602 9.564 3.683 14.528.156 1.966-1.398 2.07-1.386 4.253.491 4.019 3.457 9.129 2.27 16.67-3.873l4.437-3.614.93 3.479c1.522 5.69 7.026 7.84 12.599 4.92 2.044-1.072 2.492-1.034 4.948.415 2.588 1.527 2.846 1.538 6.21.253 1.93-.737 5.163-2.796 7.183-4.574 2.02-1.778 3.673-3.067 3.673-2.865 0 1.529-5.208 9.168-9.405 13.795-5.294 5.836-9.831 13.687-9.831 17.012 0 3.669 1.375 5.029 5.08 5.029 3.968 0 6.39-2.113 11.219-9.79 3.246-5.16 14.656-16.635 23.97-24.106 5.346-4.289 6.205-5.324 6.212-7.484.004-1.379-.547-2.966-1.224-3.528-1.026-.851-1.595-.692-3.407.951-9.543 8.66-16.076 14.301-16.56 14.301-.687 0 4.944-10.429 12.778-23.664 3.138-5.3 5.94-10.249 6.227-10.997.716-1.868-1.432-3.811-4.212-3.811-1.912 0-2.968.944-6.498 5.811-2.318 3.196-6.044 7.911-8.28 10.479-4.241 4.871-14.684 14.167-15.915 14.167-.391 0 2.206-5.575 5.77-12.389 3.565-6.814 6.48-13.118 6.48-14.008 0-.89-.95-2.242-2.112-3.003-2.057-1.348-2.155-1.332-3.683.582-.864 1.082-4.775 7.558-8.693 14.391-6.861 11.968-10.268 16.03-13.445 16.03-2.477 0-.414-7.344 5.118-18.224 4.478-8.807 5.224-10.817 4.389-11.823-1.18-1.421-4.24-1.578-6.56-.336-1.182.633-1.877.633-2.511 0-.481-.482-2.91-.876-5.396-.876-3.422 0-5.694.586-9.345 2.411-8.011 4.003-17.54 14.604-19.132 21.288-.31 1.293-1.143 3.019-1.854 3.835-1.388 1.593-5.09 3.725-6.467 3.725-3.49 0 4.32-16.723 19.654-42.079 13.598-22.486 13.527-22.356 12.934-23.902-.788-2.052-4.86-1.677-7.693.707m111.304 1.754c-4 4.53-21.353 30.511-27.096 40.567-6.297 11.026-6.362 13.986-.285 12.959 3.876-.654 3.772-.535 12.162-14.051 3.694-5.951 11.159-17.606 16.588-25.899s9.87-15.597 9.87-16.231c0-.845-1.047-1.152-3.938-1.152-3.694 0-4.15.238-7.301 3.807m-188.703-1.806c-1.745.622-4.707 2.212-6.583 3.535-2.777 1.957-4.966 2.635-11.76 3.644-8.346 1.239-26.243 1.707-27.238.712-.29-.29-.113-1.026.394-1.637 1.619-1.951-.353-2.961-3.654-1.871-7.657 2.527-8.004 10.328-.568 12.762 3.9 1.277 16.619 1.1 23.392-.325 3.18-.669 5.904-1.094 6.053-.946.424.425-23.35 35.902-26.157 39.033-1.383 1.542-2.305 2.379-2.047 1.858.258-.52.076-1.189-.405-1.486-1.934-1.196-9.374 8.206-10.117 12.785-.9 5.542 5.47 8.001 11.026 4.257 3.9-2.628 9.004-9.296 16.77-21.911 6.402-10.399 17.443-27.099 22.844-34.554 1.778-2.453 3.136-3.448 5.21-3.814 9.23-1.631 14.427-4.702 14.427-8.527 0-4.297-5.071-5.836-11.587-3.515m-115.854 1.438c-3.326 1.633-4.137 2.712-10.42 13.867-3.747 6.652-10.78 19.406-15.63 28.342-7.322 13.495-9.412 16.707-12.338 18.963-4.001 3.086-8.1 3.71-8.1 1.233 0-1.911 2.958-7.451 7.882-14.761 7.038-10.449 8.13-13.429 5.785-15.775-3.211-3.211-10.113-1.51-16.45 4.054-3.16 2.774-3.352 2.704-1.63-.597 2.04-3.913 1.616-5.101-1.821-5.101-1.665 0-3.835.566-4.823 1.258-.988.691-4.571 5.944-7.962 11.671-5.536 9.349-6.728 10.83-11.653 14.481-3.018 2.238-6.805 4.74-8.416 5.561-4.815 2.455-12.21 1.647-12.21-1.335 0-1.496 5.647-5.662 10.854-8.007 5.603-2.524 6.55-3.803 4.797-6.478-1.424-2.173-1.812-2.203-8.142-.626-2.138.533-2.216.472-1.114-.864.652-.791 2.996-2.658 5.21-4.15 3.96-2.669 4.038-2.686 4.785-1.022.63 1.407 1.238 1.616 3.607 1.24 5.592-.888 9.71-8.756 5.705-10.9-5.422-2.902-20.268 2.672-25.931 9.735-1.807 2.255-2.354 3.745-2.318 6.324.025 1.855.429 3.755.897 4.223 1.324 1.325 1.037 1.861-1.582 2.945-3.593 1.489-5.583 4.459-5.583 8.335 0 5.795 3.55 8.847 11.352 9.755 3.323.387 5.35.105 9.086-1.266 5.066-1.858 6.24-1.983 10.909-1.163 2.834.497 2.997.379 7.972-5.779 5.836-7.222 18.5-20.477 21.895-22.916 2.18-1.566 2.124-1.38-1.056 3.48-4.97 7.595-7.517 13.436-7.906 18.125-.316 3.803-.131 4.389 2.093 6.612 2.056 2.057 3.045 2.435 6.308 2.411 2.128-.016 4.769-.527 5.87-1.136 1.126-.623 2.357-.813 2.815-.433.447.372 1.89.793 3.208.936 2.289.249 2.55-.058 5.9-6.953 3.072-6.322 3.616-7.027 4.408-5.7 7.576 12.691 14.102 16.135 22.08 11.651l3.138-1.763 2.15 1.692c3.11 2.446 6.9 2.925 11.29 1.429 7.532-2.566 13.769-9.444 12.754-14.064-.295-1.344-.905-2.672-1.355-2.95-.45-.278-2.676 1.3-4.948 3.506-2.271 2.206-4.917 4.414-5.88 4.905-2.612 1.333-5.062 1.115-5.062-.449 0-.739 3.21-6.964 7.134-13.834 8.603-15.062 8.83-15.84 5.302-18.152-1.887-1.237-2.173-1.198-5.501.753-1.93 1.131-4.647 3.353-6.038 4.937-2.295 2.613-2.423 3.031-1.39 4.507 1.156 1.65.375 3.325-8.075 17.322-.6.992-2.514 2.747-4.254 3.899-4 2.646-6.308 2.16-8.99-1.894-3.486-5.267-3.447-5.999.42-8.05 8.936-4.741 18.22-15.965 17.053-20.616-1.027-4.093-7.053-3.529-8.48.794-.85 2.575-7.676 8.88-13.993 12.925-2.224 1.423-2.333 1.428-1.814.076.303-.791 5.998-11.179 12.655-23.083 6.728-12.033 11.905-22.16 11.657-22.805-.598-1.56-1.83-1.423-6.106.675m-107.134.167c-20.234 4.399-44.724 23.816-54.591 43.282-2.304 4.546-2.914 6.764-3.21 11.68-.447 7.411.916 10.697 5.174 12.477 4.953 2.069 14.024-.94 23.103-7.664 2.204-1.632 4.548-3.285 5.21-3.672 1.6-.936-11.347 13.334-16.431 18.111-2.205 2.07-6.601 6.185-9.77 9.143-7.922 7.396-8.966 10.844-3.736 12.344 3.872 1.111 6.479-.605 15.933-10.485 5.086-5.315 12.948-12.333 18.645-16.644 5.418-4.1 11.535-8.979 13.594-10.843 3.702-3.352 3.723-3.4 1.932-4.358-2.21-1.183-6.411-.024-8.573 2.365-.783.865-1.742 1.573-2.132 1.573-.834 0 6.294-9.303 15.354-20.038 3.534-4.188 6.43-8.052 6.434-8.588.005-.535-.725-1.366-1.622-1.846-1.504-.805-1.264-1.117 3.1-4.031 6.26-4.181 11.126-9.548 11.77-12.985.329-1.748.065-3.827-.722-5.712-2.14-5.118-8.571-6.477-19.462-4.109m11.539 7.359c.832 2.53-8.687 10.165-15.806 12.676-2.777.98-3.267.971-3.85-.07-.944-1.687-3.185-.611-4.657 2.236-1.103 2.133-1.1 2.56.04 4.298 1.403 2.141 4.238 3.138 7.277 2.557 2.808-.537 1.88.435-9.552 10.015-25.754 21.58-39.711 25.531-31.866 9.021 3.955-8.325 10.595-16.21 20.557-24.411 11.012-9.066 20.749-14.479 29.656-16.486 5.49-1.238 7.754-1.192 8.2.164m122.42 8.539c-1.926 1.926-2.778 3.51-2.778 5.165 0 4.956 4.707 5.378 8.979.805 1.829-1.957 2.272-3.099 2.082-5.364-.218-2.608-.488-2.901-2.873-3.131-2.118-.203-3.176.291-5.41 2.525M296.7 46.625c-6.65 3.324-14.757 11.567-18.031 18.334-2.094 4.329-2.564 6.284-2.588 10.764-.028 5.185.108 5.598 2.588 7.815 3.506 3.135 7.234 3.097 13.712-.14 5.635-2.816 13.639-10.442 18.285-17.423 2.92-4.386 5.78-11.179 5.836-13.853.042-2.107-3.137-5.518-5.144-5.518-1.016 0-2.297-.541-2.845-1.202-1.605-1.933-6.512-1.425-11.813 1.223m9.4 8.963c-.028 3.967-11.54 17.977-17.104 20.815-3.007 1.534-3.281 1.552-4.213.277-2.92-3.992 6.435-18.047 15.68-23.559 2.734-1.63 2.792-1.631 4.209-.111.79.848 1.433 2.008 1.428 2.578m37.187-1.57c-1.651 2.822-11.324 13.8-16.105 18.277-4.844 4.536-5.473 4.904-5.7 3.338-.391-2.703 3.507-9.097 8.54-14.008 5.373-5.243 15.169-10.86 13.265-7.607m39.616 2.732c-5.327 7.491-18.411 20.312-20.731 20.312-1.405 0-.776-2.581 1.67-6.857 3.8-6.642 9.105-12.011 14.563-14.738 6.855-3.425 7.679-3.191 4.498 1.283m62.268 19.451c-2.13.892-4.103 3.16-5.154 5.924-2.012 5.291 3.597 7.438 7.98 3.055 5.222-5.223 3.24-11.519-2.826-8.979"
            fill="none"
            stroke="white"
            strokeWidth="4"
            variants={logoVariants}
            initial="hidden"
            animate="visible"
          />
        </svg>

      </motion.div>

    </div>
  );
};

export default Loader;
