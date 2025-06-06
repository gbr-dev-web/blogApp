function TextArea({
  id = null,
  rows = null,
  placeholder = null,
  text = null,
  onChange = null,
  maxLength = null,
}) {
  return (
    <textarea
      maxLength={maxLength}
      onChange={onChange}
      id={id}
      rows={rows}
      class="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400 resize-none"
      placeholder={placeholder}
    >
      {text}
    </textarea>
  );
}

export default TextArea;
