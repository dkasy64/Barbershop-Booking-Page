function App() {
  const handleClick = () => {
    alert('Button clicked!');
  };

  return (
    <>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <button 
          onClick={handleClick}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Click me
        </button>
      </div>
    </>
  );
}

export default App;