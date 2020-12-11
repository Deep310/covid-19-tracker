import React, { useState, useEffect } from 'react';
import './App.css';
import {
	FormControl,
	Select,
	MenuItem,
	Card,
	CardContent,
} from '@material-ui/core';
import { Container, Row, Col } from 'react-bootstrap';
import InfoBox from './InfoBox';
import Map from './Map';
import Table from './Table';
import { sortData, prettyPrintStat, prettyPrintTotal } from './utility';
import LineGraph from './LineGraph';
import 'leaflet/dist/leaflet.css';

function App() {
	const [countries, setCountries] = useState([]);
	const [country, setCountry] = useState('worldwide');
	const [countryInfo, setCountryInfo] = useState({});
	const [tableData, setTableData] = useState([]);
	const [mapCenter, setMapCenter] = useState({ lat: 20.80746, lng: 90.4796 });
	const [mapZoom, setMapZoom] = useState(3);
	const [mapCountries, setMapCountries] = useState([]);
	const [casesType, setCasesType] = useState('cases');

	useEffect(() => {
		fetch('https://disease.sh/v3/covid-19/all')
			.then((response) => response.json())
			.then((data) => {
				setCountryInfo(data);
			});
	}, []);

	useEffect(() => {
		// has to be async

		const getCountriesData = async () => {
			await fetch('https://disease.sh/v3/covid-19/countries')
				.then((response) => response.json())
				.then((data) => {
					console.log(data);
					const countries = data.map((country) => ({
						name: country.country,
						value: country.countryInfo.iso2,
					}));

					const sortedData = sortData(data);
					setTableData(sortedData);
					setMapCountries(data);
					setCountries(countries);
				});
		};

		getCountriesData();
	}, []);

	const onCountryChange = async (event) => {
		const countryCode = event.target.value;

		const url =
			countryCode === 'worldwide'
				? 'https://disease.sh/v3/covid-19/all'
				: `https://disease.sh/v3/covid-19/countries/${countryCode}`;

		await fetch(url)
			.then((response) => response.json())
			.then((data) => {
				setCountry(countryCode);
				setCountryInfo(data);

				setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
				setMapZoom(4);
				console.log(data);
			});
	};

	return (
		<div className="app">
			<div className="app_left">
				<Container fluid>
					<Row>
						<Col lg={9} xl={9}>
							<div className="app_header">
								<h1>COVID-19 TRACKER</h1>
								<FormControl className="app_dropdown">
									<Select
										onChange={onCountryChange}
										variant="outlined"
										value={country}
									>
										<MenuItem value="worldwide">Worldwide</MenuItem>
										{countries.map((country) => (
											<MenuItem value={country.value}>
												{country.name}
											</MenuItem>
										))}
									</Select>
								</FormControl>
							</div>
						</Col>
					</Row>

					<Row>
						<Col lg={9} xl={9}>
							<div className="app_stats">
								<InfoBox
									isRed
									active={casesType === 'cases'}
									onClick={(e) => setCasesType('cases')}
									title="Coronavirus Cases"
									cases={prettyPrintStat(countryInfo.todayCases)}
									total={prettyPrintTotal(countryInfo.cases)}
								/>

								<InfoBox
									active={casesType === 'recovered'}
									onClick={(e) => setCasesType('recovered')}
									title="Recovered"
									cases={prettyPrintStat(countryInfo.todayRecovered)}
									total={prettyPrintTotal(countryInfo.recovered)}
								/>

								<InfoBox
									isRed
									active={casesType === 'deaths'}
									onClick={(e) => setCasesType('deaths')}
									title="Deaths"
									cases={prettyPrintStat(countryInfo.todayDeaths)}
									total={prettyPrintTotal(countryInfo.deaths)}
								/>
							</div>
						</Col>
					</Row>

					<Row>
						<Col lg={9} xl={9}>
							<Map
								casesType={casesType}
								countries={mapCountries}
								center={mapCenter}
								zoom={mapZoom}
							/>
						</Col>
					</Row>
				</Container>
			</div>

			<Card className="app_right">
				<CardContent>
					<h3>Live cases by country</h3>
					<Table countries={tableData} />
					<h3 className="app_graphTitle">Worldwide new {casesType}</h3>
					<LineGraph className="app_graph" casesType={casesType} />
				</CardContent>
			</Card>
		</div>
	);
}

export default App;
