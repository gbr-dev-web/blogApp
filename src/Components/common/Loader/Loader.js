import styles from"./Loader.module.css"; 

const Loader = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className={styles.loader}  />
    </div>
  );
};

export default Loader;
