import "./App.css";
import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  CircularProgress,
} from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";

const SITE_ID = "scmq7n";
const API_URL = "http://api.searchspring.net/api/search/search.json";

export default function SearchPage() {
	const [query, setQuery] = useState("");
	const [results, setResults] = useState([]);
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	useEffect(() => {
		if (query) {
			setLoading(true);
			const debounceTimeout = setTimeout(() => {
				fetchResults();
			}, 500);

			return () => clearTimeout(debounceTimeout); 
		}
	}, [page]);

	const fetchResults = async () => {
		setLoading(true);
		setError(null);
		try {
			const response = await fetch(
				`${API_URL}?siteId=${SITE_ID}&q=${query}&resultsFormat=native&page=${page}`
			);
			const data = await response.json();
			setResults(data.results || []);
			setTotalPages(data.pagination?.totalPages || 1);
		} catch (error) {
			setError("Error fetching results. Please try again.");
		}
		finally{
			setLoading(false);
		}
	};

	const handleSearch = () => {
		setPage(1);
		fetchResults();
	};

	const handleKeyDown = (e) => {
		if (e.key === "Enter") {
			handleSearch();
		}
	};

	return (
		<div className="container mx-auto p-6">
			<div className="flex gap-2 mb-6">
				<TextField
					label="Search for products..."
					variant="outlined"
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					onKeyDown={handleKeyDown}
					className="w-full"
				/>
				<Button
					onClick={handleSearch}
					variant="contained"
					color="primary"
					className="px-4 py-2"
				>
					Search
				</Button>
			</div>

			{loading && (
				<div className="loading-overlay">
					<CircularProgress />
				</div>
			)}
			{error && <p className="text-center text-red-500">{error}</p>}

			{results.length > 0 && (
				<div className="flex justify-center items-center gap-4 mt-6">
					<Button
						onClick={() => setPage((prev) => prev - 1)}
						disabled={page === 1}
						variant="contained"
						color="secondary"
						className="px-3 py-2"
					>
						<ChevronLeft /> Prev
					</Button>
					<span>
						Page {page} of {totalPages}
					</span>
					<Button
						onClick={() => setPage((prev) => prev + 1)}
						disabled={page === totalPages}
						variant="contained"
						color="secondary"
						className="px-3 py-2"
					>
						Next <ChevronRight />
					</Button>
				</div>
			)}

			<br></br>

			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
				{results.map((product) => (
					<Card key={product.id} className="p-4 border rounded-lg shadow-md">
						<img
							src={product.thumbnailImageUrl}
							alt={product.name}
							className="w-full h-48 object-cover"
						/>
						<CardContent>
							<Typography variant="h6" component="h3" className="mt-2">
								{product.name}
							</Typography>
							<Typography className="text-gray-700">
								<span className="text-green-600 font-semibold">
									${product.price}
								</span>
								{product.msrp && product.msrp > product.price && (
									<span className="text-red-500 line-through ml-2">
										${product.msrp}
									</span>
								)}
							</Typography>
						</CardContent>
					</Card>
				))}
			</div>

			{results.length > 0 && (
				<div className="flex justify-center items-center gap-4 mt-6">
					<Button
						onClick={() => setPage((prev) => prev - 1)}
						disabled={page === 1}
						variant="contained"
						color="secondary"
						className="px-3 py-2"
					>
						<ChevronLeft /> Prev
					</Button>
					<span>
						Page {page} of {totalPages}
					</span>
					<Button
						onClick={() => setPage((prev) => prev + 1)}
						disabled={page === totalPages}
						variant="contained"
						color="secondary"
						className="px-3 py-2"
					>
						Next <ChevronRight />
					</Button>
				</div>
			)}
		</div>
	);
}
