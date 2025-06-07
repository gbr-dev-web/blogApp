function Input ({type, placeholder, id = '', value = ''}) { 
    return (
        <input
        type={type}
        id={id}
        value={value}
        className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400"
        placeholder={placeholder}
      />
    )
}

export default Input