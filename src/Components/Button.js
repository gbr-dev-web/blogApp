function Button({ id, Icon, text }) {
  return (
    <>
      <button
        id={id} // "open-login-modal ou open-signup-modal"
        class="bg-teal-400 text-slate-900 px-6 py-3 rounded-lg font-semibold transition-colors duration-300 hover:bg-teal-500 flex items-center justify-center gap-2"
      >
        {Icon && <Icon class="w-5 h-5" />}
        {text}
      </button>
    </>
  );
}

export default Button;
