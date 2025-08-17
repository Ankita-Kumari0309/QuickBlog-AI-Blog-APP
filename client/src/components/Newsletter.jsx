import React from 'react';

function Newsletter() {
  return (
    <div className="flex flex-col items-center justify-center text-center space-y-4 my-32 px-6 md:px-0">
      <h1 className="md:text-4xl text-2xl font-semibold text-gray-800">
        Never Miss a Blog!
      </h1>
      <p className="md:text-lg text-gray-500 max-w-md">
        Subscribe to get the latest blogs, tech updates, and exclusive news delivered straight to your inbox.
      </p>
      
      <form className="flex w-full max-w-2xl md:h-12 h-12 mt-4">
        <input
          type="email"
          placeholder="Enter your email"
          required
          className="flex-1 border border-gray-300 rounded-l-md px-4 text-gray-700 outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <button
          type="submit"
          className="bg-primary text-white px-6 md:px-12 rounded-r-md hover:bg-primary/90 transition-colors"
        >
          Subscribe
        </button>
      </form>
    </div>
  );
}

export default Newsletter;
