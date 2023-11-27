<div
	class="rounded-[0.9rem] overflow-hidden min-w-[22rem] bg-primary shadow m-1 border border-gray-300"
>
	<div class="flex justify-end items-end text-white p-2 h-[60px]"><slot name="createdAt" /></div>
	<div class=" rounded-[0.7rem] bg-white w-full px-[1.2rem]">
		<div class="py-[20px] text-2xl flex justify-center">
			<slot name="testTitle" />
		</div>
		<div class="text-center pb-4 border-b border-gray-300">
			<h4>Your Total Score</h4>
			<div class="text-primary text-5xl"><slot name="readCorrectCount" /></div>
			<div class=" text-gray-400"><slot name="readCorrectToTotal" /></div>
		</div>
		<div class="py-[20px]">
			<div class=" flex justify-between h-[66px]">
				<p class="text-sm">Your Reading and Writing Score</p>
				<div class="text-center">
					<div class="text-2xl font-normal"><slot name="correctCount" /></div>
					<div class=" mt-1 text-xs text-gray-400"><slot name="correctToTotal" /></div>
				</div>
			</div>
			<div class=" flex justify-between">
				<p class="text-sm">Your Math Score</p>
				<div class="text-center">
					<p class="text-2xl font-normal">0</p>
					<p class=" mt-1 text-xs text-gray-400">0 to 0</p>
				</div>
			</div>
		</div>
		<div class="flex flex-col gap-2 py-2">
			<slot name="detailLink" />
		</div>
	</div>
</div>
