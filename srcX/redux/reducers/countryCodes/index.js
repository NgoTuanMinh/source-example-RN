const LOAD_MORE = 'LOAD_MORE_COUNTRIES';

const initialState = {
    countries: [
        {
          "name": "Netherlands",
          "code": "+31",
          "flag": "🇳🇱",
          "countryCode": "NL"
        },
        {
          "name": "Spain",
          "code": "+34",
          "flag": "🇪🇸",
          "countryCode": "ES"
        },
        {
          "name": "Germany",
          "code": "+49",
          "flag": "🇩🇪",
          "countryCode": "DE"
        },
        {
          "name": "United States",
          "code": "+1",
          "flag": "🇺🇸",
          "countryCode": "US"
        },
        {
          "name": "Belgium",
          "code": "+32",
          "flag": "🇧🇪",
          "countryCode": "BE"
        },
        {
          "name": "France",
          "code": "+33",
          "flag": "🇫🇷",
          "countryCode": "FR"
        },
        {
          "name": "Afghanistan",
          "code": "+93",
          "flag": "🇦🇫",
          "countryCode": "AF"
        },
        {
          "name": "Aland Islands",
          "code": "+358",
          "flag": "🇦🇽",
          "countryCode": "AX"
        },
        {
          "name": "Albania",
          "code": "+355",
          "flag": "🇦🇱",
          "countryCode": "AL"
        },
        {
          "name": "Algeria",
          "code": "+213",
          "flag": "🇩🇿",
          "countryCode": "DZ"
        },
        {
          "name": "AmericanSamoa",
          "code": "+1684",
          "flag": "🇦🇸",
          "countryCode": "AS"
        },
        {
          "name": "Andorra",
          "code": "+376",
          "flag": "🇦🇩",
          "countryCode": "AD"
        },
        {
          "name": "Angola",
          "code": "+244",
          "flag": "🇦🇴",
          "countryCode": "AO"
        },
        {
          "name": "Anguilla",
          "code": "+1264",
          "flag": "🇦🇮",
          "countryCode": "AI"
        },
        {
          "name": "Antarctica",
          "code": "+672",
          "flag": "🇦🇶",
          "countryCode": "AQ"
        },
        {
          "name": "Antigua and Barbuda",
          "code": "+1268",
          "flag": "🇦🇬",
          "countryCode": "AG"
        },
        {
          "name": "Argentina",
          "code": "+54",
          "flag": "🇦🇷",
          "countryCode": "AR"
        },
        {
          "name": "Armenia",
          "code": "+374",
          "flag": "🇦🇲",
          "countryCode": "AM"
        },
        {
          "name": "Aruba",
          "code": "+297",
          "flag": "🇦🇼",
          "countryCode": "AW"
        },
        {
          "name": "Australia",
          "code": "+61",
          "flag": "🇦🇺",
          "countryCode": "AU"
        },
        {
          "name": "Austria",
          "code": "+43",
          "flag": "🇦🇹",
          "countryCode": "AT"
        },
        {
          "name": "Azerbaijan",
          "code": "+994",
          "flag": "🇦🇿",
          "countryCode": "AZ"
        },
        {
          "name": "Bahamas",
          "code": "+1242",
          "flag": "🇧🇸",
          "countryCode": "BS"
        },
        {
          "name": "Bahrain",
          "code": "+973",
          "flag": "🇧🇭",
          "countryCode": "BH"
        },
        {
          "name": "Bangladesh",
          "code": "+880",
          "flag": "🇧🇩",
          "countryCode": "BD"
        },
        {
          "name": "Barbados",
          "code": "+1246",
          "flag": "🇧🇧",
          "countryCode": "BB"
        },
        {
          "name": "Belarus",
          "code": "+375",
          "flag": "🇧🇾",
          "countryCode": "BY"
        },
        {
          "name": "Belize",
          "code": "+501",
          "flag": "🇧🇿",
          "countryCode": "BZ"
        },
        {
          "name": "Benin",
          "code": "+229",
          "flag": "🇧🇯",
          "countryCode": "BJ"
        },
        {
          "name": "Bermuda",
          "code": "+1441",
          "flag": "🇧🇲",
          "countryCode": "BM"
        },
        {
          "name": "Bhutan",
          "code": "+975",
          "flag": "🇧🇹",
          "countryCode": "BT"
        },
        {
          "name": "Bolivia, Plurinational State of",
          "code": "+591",
          "flag": "🇧🇴",
          "countryCode": "BO"
        },
        {
          "name": "Bosnia and Herzegovina",
          "code": "+387",
          "flag": "🇧🇦",
          "countryCode": "BA"
        },
        {
          "name": "Botswana",
          "code": "+267",
          "flag": "🇧🇼",
          "countryCode": "BW"
        },
        {
          "name": "Brazil",
          "code": "+55",
          "flag": "🇧🇷",
          "countryCode": "BR"
        },
        {
          "name": "British Indian Ocean Territory",
          "code": "+246",
          "flag": "🇮🇴",
          "countryCode": "IO"
        },
        {
          "name": "Brunei Darussalam",
          "code": "+673",
          "flag": "🇧🇳",
          "countryCode": "BN"
        },
        {
          "name": "Bulgaria",
          "code": "+359",
          "flag": "🇧🇬",
          "countryCode": "BG"
        },
        {
          "name": "Burkina Faso",
          "code": "+226",
          "flag": "🇧🇫",
          "countryCode": "BF"
        },
        {
          "name": "Burundi",
          "code": "+257",
          "flag": "🇧🇮",
          "countryCode": "BI"
        },
        {
          "name": "Cambodia",
          "code": "+855",
          "flag": "🇰🇭",
          "countryCode": "KH"
        },
        {
          "name": "Cameroon",
          "code": "+237",
          "flag": "🇨🇲",
          "countryCode": "CM"
        },
        {
          "name": "Canada",
          "code": "+1",
          "flag": "🇨🇦",
          "countryCode": "CA"
        },
        {
          "name": "Cape Verde",
          "code": "+238",
          "flag": "🇨🇻",
          "countryCode": "CV"
        },
        {
          "name": "Cayman Islands",
          "code": "+ 345",
          "flag": "🇰🇾",
          "countryCode": "KY"
        },
        {
          "name": "Central African Republic",
          "code": "+236",
          "flag": "🇨🇫",
          "countryCode": "CF"
        },
        {
          "name": "Chad",
          "code": "+235",
          "flag": "🇹🇩",
          "countryCode": "TD"
        },
        {
          "name": "Chile",
          "code": "+56",
          "flag": "🇨🇱",
          "countryCode": "CL"
        },
        {
          "name": "China",
          "code": "+86",
          "flag": "🇨🇳",
          "countryCode": "CN"
        },
        {
          "name": "Christmas Island",
          "code": "+61",
          "flag": "🇨🇽",
          "countryCode": "CX"
        },
        {
          "name": "Cocos (Keeling) Islands",
          "code": "+61",
          "flag": "🇨🇨",
          "countryCode": "CC"
        },
        {
          "name": "Colombia",
          "code": "+57",
          "flag": "🇨🇴",
          "countryCode": "CO"
        },
        {
          "name": "Comoros",
          "code": "+269",
          "flag": "🇰🇲",
          "countryCode": "KM"
        },
        {
          "name": "Congo",
          "code": "+242",
          "flag": "🇨🇬",
          "countryCode": "CG"
        },
        {
          "name": "Congo, The Democratic Republic of the Congo",
          "code": "+243",
          "flag": "🇨🇩",
          "countryCode": "CD"
        },
        {
          "name": "Cook Islands",
          "code": "+682",
          "flag": "🇨🇰",
          "countryCode": "CK"
        },
        {
          "name": "Costa Rica",
          "code": "+506",
          "flag": "🇨🇷",
          "countryCode": "CR"
        },
        {
          "name": "Cote d'Ivoire",
          "code": "+225",
          "flag": "🇨🇮",
          "countryCode": "CI"
        },
        {
          "name": "Croatia",
          "code": "+385",
          "flag": "🇭🇷",
          "countryCode": "HR"
        },
        {
          "name": "Cuba",
          "code": "+53",
          "flag": "🇨🇺",
          "countryCode": "CU"
        },
        {
          "name": "Cyprus",
          "code": "+357",
          "flag": "🇨🇾",
          "countryCode": "CY"
        },
        {
          "name": "Czech Republic",
          "code": "+420",
          "flag": "🇨🇿",
          "countryCode": "CZ"
        },
        {
          "name": "Denmark",
          "code": "+45",
          "flag": "🇩🇰",
          "countryCode": "DK"
        },
        {
          "name": "Djibouti",
          "code": "+253",
          "flag": "🇩🇯",
          "countryCode": "DJ"
        },
        {
          "name": "Dominica",
          "code": "+1767",
          "flag": "🇩🇲",
          "countryCode": "DM"
        },
        {
          "name": "Dominican Republic",
          "code": "+1849",
          "flag": "🇩🇴",
          "countryCode": "DO"
        },
        {
          "name": "Ecuador",
          "code": "+593",
          "flag": "🇪🇨",
          "countryCode": "EC"
        },
        {
          "name": "Egypt",
          "code": "+20",
          "flag": "🇪🇬",
          "countryCode": "EG"
        },
        {
          "name": "El Salvador",
          "code": "+503",
          "flag": "🇸🇻",
          "countryCode": "SV"
        },
        {
          "name": "Equatorial Guinea",
          "code": "+240",
          "flag": "🇬🇶",
          "countryCode": "GQ"
        },
        {
          "name": "Eritrea",
          "code": "+291",
          "flag": "🇪🇷",
          "countryCode": "ER"
        },
        {
          "name": "Estonia",
          "code": "+372",
          "flag": "🇪🇪",
          "countryCode": "EE"
        },
        {
          "name": "Ethiopia",
          "code": "+251",
          "flag": "🇪🇹",
          "countryCode": "ET"
        },
        {
          "name": "Falkland Islands (Malvinas)",
          "code": "+500",
          "flag": "🇫🇰",
          "countryCode": "FK"
        },
        {
          "name": "Faroe Islands",
          "code": "+298",
          "flag": "🇫🇴",
          "countryCode": "FO"
        },
        {
          "name": "Fiji",
          "code": "+679",
          "flag": "🇫🇯",
          "countryCode": "FJ"
        },
        {
          "name": "Finland",
          "code": "+358",
          "flag": "🇫🇮",
          "countryCode": "FI"
        },
        {
          "name": "French Guiana",
          "code": "+594",
          "flag": "🇬🇫",
          "countryCode": "GF"
        },
        {
          "name": "French Polynesia",
          "code": "+689",
          "flag": "🇵🇫",
          "countryCode": "PF"
        },
        {
          "name": "Gabon",
          "code": "+241",
          "flag": "🇬🇦",
          "countryCode": "GA"
        },
        {
          "name": "Gambia",
          "code": "+220",
          "flag": "🇬🇲",
          "countryCode": "GM"
        },
        {
          "name": "Georgia",
          "code": "+995",
          "flag": "🇬🇪",
          "countryCode": "GE"
        },
        {
          "name": "Ghana",
          "code": "+233",
          "flag": "🇬🇭",
          "countryCode": "GH"
        },
        {
          "name": "Gibraltar",
          "code": "+350",
          "flag": "🇬🇮",
          "countryCode": "GI"
        },
        {
          "name": "Greece",
          "code": "+30",
          "flag": "🇬🇷",
          "countryCode": "GR"
        },
        {
          "name": "Greenland",
          "code": "+299",
          "flag": "🇬🇱",
          "countryCode": "GL"
        },
        {
          "name": "Grenada",
          "code": "+1473",
          "flag": "🇬🇩",
          "countryCode": "GD"
        },
        {
          "name": "Guadeloupe",
          "code": "+590",
          "flag": "🇬🇵",
          "countryCode": "GP"
        },
        {
          "name": "Guam",
          "code": "+1671",
          "flag": "🇬🇺",
          "countryCode": "GU"
        },
        {
          "name": "Guatemala",
          "code": "+502",
          "flag": "🇬🇹",
          "countryCode": "GT"
        },
        {
          "name": "Guernsey",
          "code": "+44",
          "flag": "🇬🇬",
          "countryCode": "GG"
        },
        {
          "name": "Guinea",
          "code": "+224",
          "flag": "🇬🇳",
          "countryCode": "GN"
        },
        {
          "name": "Guinea-Bissau",
          "code": "+245",
          "flag": "🇬🇼",
          "countryCode": "GW"
        },
        {
          "name": "Guyana",
          "code": "+595",
          "flag": "🇬🇾",
          "countryCode": "GY"
        },
        {
          "name": "Haiti",
          "code": "+509",
          "flag": "🇭🇹",
          "countryCode": "HT"
        },
        {
          "name": "Holy See (Vatican City State)",
          "code": "+379",
          "flag": "🇻🇦",
          "countryCode": "VA"
        },
        {
          "name": "Honduras",
          "code": "+504",
          "flag": "🇭🇳",
          "countryCode": "HN"
        },
        {
          "name": "Hong Kong",
          "code": "+852",
          "flag": "🇭🇰",
          "countryCode": "HK"
        },
        {
          "name": "Hungary",
          "code": "+36",
          "flag": "🇭🇺",
          "countryCode": "HU"
        },
        {
          "name": "Iceland",
          "code": "+354",
          "flag": "🇮🇸",
          "countryCode": "IS"
        },
        {
          "name": "India",
          "code": "+91",
          "flag": "🇮🇳",
          "countryCode": "IN"
        },
        {
          "name": "Indonesia",
          "code": "+62",
          "flag": "🇮🇩",
          "countryCode": "ID"
        },
        {
          "name": "Iran, Islamic Republic of Persian Gulf",
          "code": "+98",
          "flag": "🇮🇷",
          "countryCode": "IR"
        },
        {
          "name": "Iraq",
          "code": "+964",
          "flag": "🇮🇶",
          "countryCode": "IQ"
        },
        {
          "name": "Ireland",
          "code": "+353",
          "flag": "🇮🇪",
          "countryCode": "IE"
        },
        {
          "name": "Isle of Man",
          "code": "+44",
          "flag": "🇮🇲",
          "countryCode": "IM"
        },
        {
          "name": "Israel",
          "code": "+972",
          "flag": "🇮🇱",
          "countryCode": "IL"
        },
        {
          "name": "Italy",
          "code": "+39",
          "flag": "🇮🇹",
          "countryCode": "IT"
        },
        {
          "name": "Jamaica",
          "code": "+1876",
          "flag": "🇯🇲",
          "countryCode": "JM"
        },
        {
          "name": "Japan",
          "code": "+81",
          "flag": "🇯🇵",
          "countryCode": "JP"
        },
        {
          "name": "Jersey",
          "code": "+44",
          "flag": "🇯🇪",
          "countryCode": "JE"
        },
        {
          "name": "Jordan",
          "code": "+962",
          "flag": "🇯🇴",
          "countryCode": "JO"
        },
        {
          "name": "Kazakhstan",
          "code": "+77",
          "flag": "🇰🇿",
          "countryCode": "KZ"
        },
        {
          "name": "Kenya",
          "code": "+254",
          "flag": "🇰🇪",
          "countryCode": "KE"
        },
        {
          "name": "Kiribati",
          "code": "+686",
          "flag": "🇰🇮",
          "countryCode": "KI"
        },
        {
          "name": "Korea, Democratic People's Republic of Korea",
          "code": "+850",
          "flag": "🇰🇵",
          "countryCode": "KP"
        },
        {
          "name": "Korea, Republic of South Korea",
          "code": "+82",
          "flag": "🇰🇷",
          "countryCode": "KR"
        },
        {
          "name": "Kuwait",
          "code": "+965",
          "flag": "🇰🇼",
          "countryCode": "KW"
        },
        {
          "name": "Kyrgyzstan",
          "code": "+996",
          "flag": "🇰🇬",
          "countryCode": "KG"
        },
        {
          "name": "Laos",
          "code": "+856",
          "flag": "🇱🇦",
          "countryCode": "LA"
        },
        {
          "name": "Latvia",
          "code": "+371",
          "flag": "🇱🇻",
          "countryCode": "LV"
        },
        {
          "name": "Lebanon",
          "code": "+961",
          "flag": "🇱🇧",
          "countryCode": "LB"
        },
        {
          "name": "Lesotho",
          "code": "+266",
          "flag": "🇱🇸",
          "countryCode": "LS"
        },
        {
          "name": "Liberia",
          "code": "+231",
          "flag": "🇱🇷",
          "countryCode": "LR"
        },
        {
          "name": "Libyan Arab Jamahiriya",
          "code": "+218",
          "flag": "🇱🇾",
          "countryCode": "LY"
        },
        {
          "name": "Liechtenstein",
          "code": "+423",
          "flag": "🇱🇮",
          "countryCode": "LI"
        },
        {
          "name": "Lithuania",
          "code": "+370",
          "flag": "🇱🇹",
          "countryCode": "LT"
        },
        {
          "name": "Luxembourg",
          "code": "+352",
          "flag": "🇱🇺",
          "countryCode": "LU"
        },
        {
          "name": "Macao",
          "code": "+853",
          "flag": "🇲🇴",
          "countryCode": "MO"
        },
        {
          "name": "Macedonia",
          "code": "+389",
          "flag": "🇲🇰",
          "countryCode": "MK"
        },
        {
          "name": "Madagascar",
          "code": "+261",
          "flag": "🇲🇬",
          "countryCode": "MG"
        },
        {
          "name": "Malawi",
          "code": "+265",
          "flag": "🇲🇼",
          "countryCode": "MW"
        },
        {
          "name": "Malaysia",
          "code": "+60",
          "flag": "🇲🇾",
          "countryCode": "MY"
        },
        {
          "name": "Maldives",
          "code": "+960",
          "flag": "🇲🇻",
          "countryCode": "MV"
        },
        {
          "name": "Mali",
          "code": "+223",
          "flag": "🇲🇱",
          "countryCode": "ML"
        },
        {
          "name": "Malta",
          "code": "+356",
          "flag": "🇲🇹",
          "countryCode": "MT"
        },
        {
          "name": "Marshall Islands",
          "code": "+692",
          "flag": "🇲🇭",
          "countryCode": "MH"
        },
        {
          "name": "Martinique",
          "code": "+596",
          "flag": "🇲🇶",
          "countryCode": "MQ"
        },
        {
          "name": "Mauritania",
          "code": "+222",
          "flag": "🇲🇷",
          "countryCode": "MR"
        },
        {
          "name": "Mauritius",
          "code": "+230",
          "flag": "🇲🇺",
          "countryCode": "MU"
        },
        {
          "name": "Mayotte",
          "code": "+262",
          "flag": "🇾🇹",
          "countryCode": "YT"
        },
        {
          "name": "Mexico",
          "code": "+52",
          "flag": "🇲🇽",
          "countryCode": "MX"
        },
        {
          "name": "Micronesia, Federated States of Micronesia",
          "code": "+691",
          "flag": "🇫🇲",
          "countryCode": "FM"
        },
        {
          "name": "Moldova",
          "code": "+373",
          "flag": "🇲🇩",
          "countryCode": "MD"
        },
        {
          "name": "Monaco",
          "code": "+377",
          "flag": "🇲🇨",
          "countryCode": "MC"
        },
        {
          "name": "Mongolia",
          "code": "+976",
          "flag": "🇲🇳",
          "countryCode": "MN"
        },
        {
          "name": "Montenegro",
          "code": "+382",
          "flag": "🇲🇪",
          "countryCode": "ME"
        },
        {
          "name": "Montserrat",
          "code": "+1664",
          "flag": "🇲🇸",
          "countryCode": "MS"
        },
        {
          "name": "Morocco",
          "code": "+212",
          "flag": "🇲🇦",
          "countryCode": "MA"
        },
        {
          "name": "Mozambique",
          "code": "+258",
          "flag": "🇲🇿",
          "countryCode": "MZ"
        },
        {
          "name": "Myanmar",
          "code": "+95",
          "flag": "🇲🇲",
          "countryCode": "MM"
        },
        {
          "name": "Namibia",
          "code": "+264",
          "flag": "🇳🇦",
          "countryCode": "NA"
        },
        {
          "name": "Nauru",
          "code": "+674",
          "flag": "🇳🇷",
          "countryCode": "NR"
        },
        {
          "name": "Nepal",
          "code": "+977",
          "flag": "🇳🇵",
          "countryCode": "NP"
        },
        {
          "name": "New Caledonia",
          "code": "+687",
          "flag": "🇳🇨",
          "countryCode": "NC"
        },
        {
          "name": "New Zealand",
          "code": "+64",
          "flag": "🇳🇿",
          "countryCode": "NZ"
        },
        {
          "name": "Nicaragua",
          "code": "+505",
          "flag": "🇳🇮",
          "countryCode": "NI"
        },
        {
          "name": "Niger",
          "code": "+227",
          "flag": "🇳🇪",
          "countryCode": "NE"
        },
        {
          "name": "Nigeria",
          "code": "+234",
          "flag": "🇳🇬",
          "countryCode": "NG"
        },
        {
          "name": "Niue",
          "code": "+683",
          "flag": "🇳🇺",
          "countryCode": "NU"
        },
        {
          "name": "Norfolk Island",
          "code": "+672",
          "flag": "🇳🇫",
          "countryCode": "NF"
        },
        {
          "name": "Northern Mariana Islands",
          "code": "+1670",
          "flag": "🇲🇵",
          "countryCode": "MP"
        },
        {
          "name": "Norway",
          "code": "+47",
          "flag": "🇳🇴",
          "countryCode": "NO"
        },
        {
          "name": "Oman",
          "code": "+968",
          "flag": "🇴🇲",
          "countryCode": "OM"
        },
        {
          "name": "Pakistan",
          "code": "+92",
          "flag": "🇵🇰",
          "countryCode": "PK"
        },
        {
          "name": "Palau",
          "code": "+680",
          "flag": "🇵🇼",
          "countryCode": "PW"
        },
        {
          "name": "Palestinian Territory, Occupied",
          "code": "+970",
          "flag": "🇵🇸",
          "countryCode": "PS"
        },
        {
          "name": "Panama",
          "code": "+507",
          "flag": "🇵🇦",
          "countryCode": "PA"
        },
        {
          "name": "Papua New Guinea",
          "code": "+675",
          "flag": "🇵🇬",
          "countryCode": "PG"
        },
        {
          "name": "Paraguay",
          "code": "+595",
          "flag": "🇵🇾",
          "countryCode": "PY"
        },
        {
          "name": "Peru",
          "code": "+51",
          "flag": "🇵🇪",
          "countryCode": "PE"
        },
        {
          "name": "Philippines",
          "code": "+63",
          "flag": "🇵🇭",
          "countryCode": "PH"
        },
        {
          "name": "Pitcairn",
          "code": "+872",
          "flag": "🇵🇳",
          "countryCode": "PN"
        },
        {
          "name": "Poland",
          "code": "+48",
          "flag": "🇵🇱",
          "countryCode": "PL"
        },
        {
          "name": "Portugal",
          "code": "+351",
          "flag": "🇵🇹",
          "countryCode": "PT"
        },
        {
          "name": "Puerto Rico",
          "code": "+1939",
          "flag": "🇵🇷",
          "countryCode": "PR"
        },
        {
          "name": "Qatar",
          "code": "+974",
          "flag": "🇶🇦",
          "countryCode": "QA"
        },
        {
          "name": "Romania",
          "code": "+40",
          "flag": "🇷🇴",
          "countryCode": "RO"
        },
        {
          "name": "Russia",
          "code": "+7",
          "flag": "🇷🇺",
          "countryCode": "RU"
        },
        {
          "name": "Rwanda",
          "code": "+250",
          "flag": "🇷🇼",
          "countryCode": "RW"
        },
        {
          "name": "Reunion",
          "code": "+262",
          "flag": "🇷🇪",
          "countryCode": "RE"
        },
        {
          "name": "Saint Barthelemy",
          "code": "+590",
          "flag": "🇧🇱",
          "countryCode": "BL"
        },
        {
          "name": "Saint Helena, Ascension and Tristan Da Cunha",
          "code": "+290",
          "flag": "🇸🇭",
          "countryCode": "SH"
        },
        {
          "name": "Saint Kitts and Nevis",
          "code": "+1869",
          "flag": "🇰🇳",
          "countryCode": "KN"
        },
        {
          "name": "Saint Lucia",
          "code": "+1758",
          "flag": "🇱🇨",
          "countryCode": "LC"
        },
        {
          "name": "Saint Martin",
          "code": "+590",
          "flag": "🇲🇫",
          "countryCode": "MF"
        },
        {
          "name": "Saint Pierre and Miquelon",
          "code": "+508",
          "flag": "🇵🇲",
          "countryCode": "PM"
        },
        {
          "name": "Saint Vincent and the Grenadines",
          "code": "+1784",
          "flag": "🇻🇨",
          "countryCode": "VC"
        },
        {
          "name": "Samoa",
          "code": "+685",
          "flag": "🇼🇸",
          "countryCode": "WS"
        },
        {
          "name": "San Marino",
          "code": "+378",
          "flag": "🇸🇲",
          "countryCode": "SM"
        },
        {
          "name": "Sao Tome and Principe",
          "code": "+239",
          "flag": "🇸🇹",
          "countryCode": "ST"
        },
        {
          "name": "Saudi Arabia",
          "code": "+966",
          "flag": "🇸🇦",
          "countryCode": "SA"
        },
        {
          "name": "Senegal",
          "code": "+221",
          "flag": "🇸🇳",
          "countryCode": "SN"
        },
        {
          "name": "Serbia",
          "code": "+381",
          "flag": "🇷🇸",
          "countryCode": "RS"
        },
        {
          "name": "Seychelles",
          "code": "+248",
          "flag": "🇸🇨",
          "countryCode": "SC"
        },
        {
          "name": "Sierra Leone",
          "code": "+232",
          "flag": "🇸🇱",
          "countryCode": "SL"
        },
        {
          "name": "Singapore",
          "code": "+65",
          "flag": "🇸🇬",
          "countryCode": "SG"
        },
        {
          "name": "Slovakia",
          "code": "+421",
          "flag": "🇸🇰",
          "countryCode": "SK"
        },
        {
          "name": "Slovenia",
          "code": "+386",
          "flag": "🇸🇮",
          "countryCode": "SI"
        },
        {
          "name": "Solomon Islands",
          "code": "+677",
          "flag": "🇸🇧",
          "countryCode": "SB"
        },
        {
          "name": "Somalia",
          "code": "+252",
          "flag": "🇸🇴",
          "countryCode": "SO"
        },
        {
          "name": "South Africa",
          "code": "+27",
          "flag": "🇿🇦",
          "countryCode": "ZA"
        },
        {
          "name": "South Sudan",
          "code": "+211",
          "flag": "🇸🇸",
          "countryCode": "SS"
        },
        {
          "name": "South Georgia and the South Sandwich Islands",
          "code": "+500",
          "flag": "🇬🇸",
          "countryCode": "GS"
        },
        {
          "name": "Sri Lanka",
          "code": "+94",
          "flag": "🇱🇰",
          "countryCode": "LK"
        },
        {
          "name": "Sudan",
          "code": "+249",
          "flag": "🇸🇩",
          "countryCode": "SD"
        },
        {
          "name": "Suriname",
          "code": "+597",
          "flag": "🇸🇷",
          "countryCode": "SR"
        },
        {
          "name": "Svalbard and Jan Mayen",
          "code": "+47",
          "flag": "🇸🇯",
          "countryCode": "SJ"
        },
        {
          "name": "Swaziland",
          "code": "+268",
          "flag": "🇸🇿",
          "countryCode": "SZ"
        },
        {
          "name": "Sweden",
          "code": "+46",
          "flag": "🇸🇪",
          "countryCode": "SE"
        },
        {
          "name": "Switzerland",
          "code": "+41",
          "flag": "🇨🇭",
          "countryCode": "CH"
        },
        {
          "name": "Syrian Arab Republic",
          "code": "+963",
          "flag": "🇸🇾",
          "countryCode": "SY"
        },
        {
          "name": "Taiwan",
          "code": "+886",
          "flag": "🇹🇼",
          "countryCode": "TW"
        },
        {
          "name": "Tajikistan",
          "code": "+992",
          "flag": "🇹🇯",
          "countryCode": "TJ"
        },
        {
          "name": "Tanzania, United Republic of Tanzania",
          "code": "+255",
          "flag": "🇹🇿",
          "countryCode": "TZ"
        },
        {
          "name": "Thailand",
          "code": "+66",
          "flag": "🇹🇭",
          "countryCode": "TH"
        },
        {
          "name": "Timor-Leste",
          "code": "+670",
          "flag": "🇹🇱",
          "countryCode": "TL"
        },
        {
          "name": "Togo",
          "code": "+228",
          "flag": "🇹🇬",
          "countryCode": "TG"
        },
        {
          "name": "Tokelau",
          "code": "+690",
          "flag": "🇹🇰",
          "countryCode": "TK"
        },
        {
          "name": "Tonga",
          "code": "+676",
          "flag": "🇹🇴",
          "countryCode": "TO"
        },
        {
          "name": "Trinidad and Tobago",
          "code": "+1868",
          "flag": "🇹🇹",
          "countryCode": "TT"
        },
        {
          "name": "Tunisia",
          "code": "+216",
          "flag": "🇹🇳",
          "countryCode": "TN"
        },
        {
          "name": "Turkey",
          "code": "+90",
          "flag": "🇹🇷",
          "countryCode": "TR"
        },
        {
          "name": "Turkmenistan",
          "code": "+993",
          "flag": "🇹🇲",
          "countryCode": "TM"
        },
        {
          "name": "Turks and Caicos Islands",
          "code": "+1649",
          "flag": "🇹🇨",
          "countryCode": "TC"
        },
        {
          "name": "Tuvalu",
          "code": "+688",
          "flag": "🇹🇻",
          "countryCode": "TV"
        },
        {
          "name": "Uganda",
          "code": "+256",
          "flag": "🇺🇬",
          "countryCode": "UG"
        },
        {
          "name": "Ukraine",
          "code": "+380",
          "flag": "🇺🇦",
          "countryCode": "UA"
        },
        {
          "name": "United Arab Emirates",
          "code": "+971",
          "flag": "🇦🇪",
          "countryCode": "AE"
        },
        {
          "name": "United Kingdom",
          "code": "+44",
          "flag": "🇬🇧",
          "countryCode": "GB"
        },
        {
          "name": "Uruguay",
          "code": "+598",
          "flag": "🇺🇾",
          "countryCode": "UY"
        },
        {
          "name": "Uzbekistan",
          "code": "+998",
          "flag": "🇺🇿",
          "countryCode": "UZ"
        },
        {
          "name": "Vanuatu",
          "code": "+678",
          "flag": "🇻🇺",
          "countryCode": "VU"
        },
        {
          "name": "Venezuela, Bolivarian Republic of Venezuela",
          "code": "+58",
          "flag": "🇻🇪",
          "countryCode": "VE"
        },
        {
          "name": "Vietnam",
          "code": "+84",
          "flag": "🇻🇳",
          "countryCode": "VN"
        },
        {
          "name": "Virgin Islands, British",
          "code": "+1284",
          "flag": "🇻🇬",
          "countryCode": "VG"
        },
        {
          "name": "Virgin Islands, U.S.",
          "code": "+1340",
          "flag": "🇻🇮",
          "countryCode": "VI"
        },
        {
          "name": "Wallis and Futuna",
          "code": "+681",
          "flag": "🇼🇫",
          "countryCode": "WF"
        },
        {
          "name": "Yemen",
          "code": "+967",
          "flag": "🇾🇪",
          "countryCode": "YE"
        },
        {
          "name": "Zambia",
          "code": "+260",
          "flag": "🇿🇲",
          "countryCode": "ZM"
        },
        {
          "name": "Zimbabwe",
          "code": "+263",
          "flag": "🇿🇼",
          "countryCode": "ZW"
        }
      ]    
}

export default function (state = initialState, action) {
    switch (action.type) {
        case LOAD_MORE:
            return {
                ...state,
                countries: [
                    ...state.countries,
                    action.payload
                ]
            }

        default:
            return state;
    }
}

export const loadMoreCountries = payload => {
    return {
        action: LOAD_MORE,
        payload
    }
}