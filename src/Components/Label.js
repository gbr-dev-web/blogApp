function Label({ text, htmlFor }) {
  return (
    <label
   
      htmlFor={htmlFor}
      className="block text-gray-300 text-sm font-bold mb-1"
    >
      {text}
    </label>
  );
}

export default Label;
