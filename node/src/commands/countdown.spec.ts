import countdown from "./countdown";

describe('countdown', () => {
	it('should have the expected exports', () => {
		expect(countdown.data).toBeDefined();
		expect(countdown.execute).toBeDefined();
	});
});