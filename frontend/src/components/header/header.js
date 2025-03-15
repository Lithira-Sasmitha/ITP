const Header = ({ title }) => {
	return (
		<header className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg border-b border-gray-700 fixed top-0 left-0 w-[calc(100%-256px)] ml-64 z-50 h-16 flex items-center ">

			<div className=" max-w-full mx-0 py-1 px-5 "> 
				<h1 className="text-2xl font-semibold text-gray-100">{title}</h1> 
			</div>
		</header>
	);
};
export default Header;
