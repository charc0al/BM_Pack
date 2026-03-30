const { log, LogLevel } = require("@peacockproject/core/loggingInterop")
const { OfficialServerAuth } = require("@peacockproject/core/officialServerAuth")
const entitlementStrategies = require("@peacockproject/core/entitlementStrategies")
const platformEntitlements = require("@peacockproject/core/platformEntitlements")

const FALLBACK_H1_EPIC_ENTITLEMENTS = ["0a73eaedcac84bd28b567dbec764c5cb", "81aecb49a60b47478e61e1cbd68d63c5"]

const FALLBACK_H3_EPIC_ENTITLEMENTS = [
	"06d4d61bbb774ca99c1661bee04fbde0",
	"2e4ad3e9aa9b4dcfa709b3f3b44cbf94",
	"a9b1afdd05584441aeec75ba230b2e54",
	"66246e4364134f4689da72e9c6731687",
	"4216cdf59dbc4f19af227be076520202",
	"8a690003855745e884d5040c6bc9ede8",
	"bc610b36c75442299edcbe99f6f0fb60",
	"5d06a6c6af9b4875b3530d5328f61287",
	"0b59243cb8aa420691b66be1ecbe68c0",
	"894d1e6771044f48a8fdde934b8e443a",
	"e698e1a4b63947b0bc9349a5ae2dc015",
	"391d08a543dc43a083eb50246916a291",
	"afa4b921503f43339c360d4b53910791",
	"6408de14f7dc46b9a33adcf6cbc4d159",
	"b4e2e682cecd42b3a7017ee4838b4593",
	"1dea1e39a8044a69b4020845afb4bd97",
	"feeac4b521734f22ae99e8ac55a5f896",
	"0e8632b4cdfb415e94291d97d727b98d",
	"3f9adc216dde44dda5e829f11740a0a2",
	"aece009ff59441c0b526f8aa69e24cfb",
	"dfe5aeb89976450ba1e0e2c208b63d33",
	"30107bff80024d1ab291f9cd3bac9fac",
	"9e936ed2507a473db6f53ad24d2da587",
	"0403062df0d347619c8dcf043c65c02e",
	"a3509775467d4d6a8a7adffe518dc204",
	"84a1a6fda4fb48afbb78ee9b2addd475",
	"08d2bc4d20754191b6c488541d2b4fa1",
	"a1e9a63fa4f3425aa66b9b8fa3c9cc35",
	"28455871cd0d4ffab52f557cc012ea5e",
	"9220c020262f420da06eb46a4b1ce86f",
	"6cdf07da030d4f66acd50eaf3cd234c7",
	"f04198e0ffcf49079b5ec77bb6b66891",
	"70a9afcc8de84b6ab0f2b45b2018559b",
	"256eeeb3d8044aa1840e1606d268e0b2",
	"04cb1b3e5b424308be25236f6bc1b2fb",
	"0047ddcd5e6846e881f1037c1416e3d9",
	"b135c766d25948c39d7dd316dbc4db53"
]

const FALLBACK_H1_STEAM_ENTITLEMENTS = [
	"439870",
	"439890",
	"440930",
	"440940",
	"440960",
	"440961",
	"440962",
	"440970",
	"440971",
	"440972",
	"505180",
	"505200",
	"505201",
	"588660",
	"588780",
	"664270",
	"725350",
	"725351",
	"725352",
	"725353",
	"737780"
]

const FALLBACK_H2_STEAM_ENTITLEMENTS = [
	"863550",
	"950540",
	"950550",
	"950551",
	"950552",
	"950553",
	"950554",
	"950555",
	"950556",
	"950557",
	"950558",
	"950559",
	"950560",
	"950561",
	"950562",
	"953090",
	"953091",
	"953092",
	"953093",
	"953094",
	"953095",
	"953096",
	"957690",
	"957691",
	"957692",
	"957693",
	"957694",
	"957695",
	"957696",
	"957697",
	"957698",
	"957730",
	"957731",
	"957733",
	"957735",
	"960831",
	"960832",
	"972340",
	"977941"
]

const FALLBACK_H3_STEAM_ENTITLEMENTS = [
	"4328240",
	"4097630",
	"3957470",
	"3711140",
	"3254350",
	"3110360",
	"2973650",
	"2828470",
	"2475260",
	"2184791",
	"2184790",
	"1843460",
	"1829605",
	"1829604",
	"1829603",
	"1829602",
	"1829601",
	"1829600",
	"1829596",
	"1829595",
	"1829594",
	"1829593",
	"1829592",
	"1829591",
	"1829590",
	"1829587",
	"1829586",
	"1829585",
	"1829584",
	"1829583",
	"1829582",
	"1829581",
	"1829580"
]

function unique(values) {
	return Array.from(new Set(values))
}

module.exports = async function offlineAuthEntitlementsPlugin() {
	const epicNamespaces = [platformEntitlements.EPIC_NAMESPACE_2016, platformEntitlements.EPIC_NAMESPACE_2021].filter(
		Boolean
	)

	const steamNamespaces = [
		platformEntitlements.STEAM_NAMESPACE_2016,
		platformEntitlements.STEAM_NAMESPACE_SCPC,
		platformEntitlements.STEAM_NAMESPACE_2018,
		platformEntitlements.STEAM_NAMESPACE_2021
	].filter(Boolean)

	const h1Epic = platformEntitlements.H1_EPIC_ENTITLEMENTS || FALLBACK_H1_EPIC_ENTITLEMENTS
	const h3Epic = platformEntitlements.H3_EPIC_ENTITLEMENTS || FALLBACK_H3_EPIC_ENTITLEMENTS
	const h1Steam = platformEntitlements.H1_STEAM_ENTITLEMENTS || FALLBACK_H1_STEAM_ENTITLEMENTS
	const h2Steam = platformEntitlements.H2_STEAM_ENTITLEMENTS || FALLBACK_H2_STEAM_ENTITLEMENTS
	const h3Steam = platformEntitlements.H3_STEAM_ENTITLEMENTS || FALLBACK_H3_STEAM_ENTITLEMENTS

	const allEpic = unique(
		(platformEntitlements.ALL_EPIC_ENTITLEMENTS || []).concat(epicNamespaces).concat(h1Epic).concat(h3Epic)
	)

	const allSteam = unique(
		(platformEntitlements.ALL_STEAM_ENTITLEMENTS || [])
			.concat(steamNamespaces)
			.concat(h1Steam)
			.concat(h2Steam)
			.concat(h3Steam)
	)

	OfficialServerAuth.prototype._initiallyAuthenticate = async function () {
		this.initialized = true
	}

	OfficialServerAuth.prototype._doRefresh = async function () {
		this.initialized = true
	}

	entitlementStrategies.IOIStrategy.prototype.get = async function () {
		return allSteam.slice()
	}

	entitlementStrategies.EpicH3Strategy.prototype.get = async function () {
		return allEpic.slice()
	}

	entitlementStrategies.EpicH1Strategy.prototype.get = function () {
		return unique(epicNamespaces.concat(h1Epic))
	}

	entitlementStrategies.SteamH1Strategy.prototype.get = function () {
		return unique([platformEntitlements.STEAM_NAMESPACE_2016].concat(h1Steam))
	}

	entitlementStrategies.SteamH2Strategy.prototype.get = function () {
		return unique([platformEntitlements.STEAM_NAMESPACE_2018].concat(h2Steam))
	}

	entitlementStrategies.SteamScpcStrategy.prototype.get = function () {
		return (
			platformEntitlements.SCPC_ENTITLEMENTS || [
				platformEntitlements.STEAM_NAMESPACE_2016,
				platformEntitlements.STEAM_NAMESPACE_SCPC
			]
		).slice()
	}

	log(
		LogLevel.INFO,
		"[offlineAuthEntitlements] Patched official auth bootstrap and entitlement strategies for offline use.",
		"plugins"
	)
}
