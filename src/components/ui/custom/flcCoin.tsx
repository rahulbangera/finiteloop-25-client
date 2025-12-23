const Coin3D = () => {
	return (
		<div className="relative w-24 h-24 my-8 preserve-3d animate-coin-spin">
			{/* Front Face */}
			<div className="absolute inset-0 w-full h-full rounded-full bg-linear-to-tr from-yellow-400 to-yellow-600 border-4 border-yellow-700 flex items-center justify-center backface-hidden shadow-xl z-20">
				<div className="w-[85%] h-[85%] rounded-full border-2 border-yellow-300 border-dashed flex items-center justify-center">
					<span className="font-bold text-2xl text-yellow-900 drop-shadow-sm">
						FLC
					</span>
				</div>
			</div>

			{/* Back Face */}
			<div className="absolute inset-0 w-full h-full rounded-full bg-linear-to-tr from-yellow-400 to-yellow-600 border-4 border-yellow-700 flex items-center justify-center backface-hidden shadow-xl rotate-y-180 z-10">
				<div className="w-[85%] h-[85%] rounded-full border-2 border-yellow-300 border-dashed flex items-center justify-center">
					<span className="font-bold text-2xl text-yellow-900 drop-shadow-sm">
						COIN
					</span>
				</div>
			</div>

			<style jsx>{`
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
		</div>
	);
};

export default Coin3D;
