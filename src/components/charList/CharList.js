import { Component } from 'react';
import MarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';

import './charList.scss';

class CharList extends Component {
	state = {
		characters: [],
		loading: true,
		error: false,
		moreCharsLoading: false,
		offset: 1541,
		charEnded: false,
	};

	marvelService = new MarvelService();

	componentDidMount() {
		this.onRequest(this.state.offset);
	}

	onRequest = offset => {
		this.setState({
			moreCharsLoading: true,
		});

		this.marvelService
			.getAllCharacters(offset)
			.then(response => {
				let ended = false;
				if (response.length < 9) {
					ended = true;
				}

				this.setState(({ characters, offset }) => ({
					characters: [...characters, ...response],
					loading: false,
					moreCharsLoading: false,
					offset: offset + 9,
					charEnded: ended,
				}));
			})
			.catch(() => {
				this.setState({
					loading: false,
					error: true,
				});
			});
	};

	render() {
		const { characters, loading, error, moreCharsLoading, offset, charEnded } = this.state;
		const { onCharSelected } = this.props;

		const errorMessage = error ? <ErrorMessage /> : null;
		const spinner = loading ? <Spinner /> : null;
		const content =
			loading || error || !characters ? null : (
				<View characters={characters} onCharSelected={onCharSelected} />
			);

		return (
			<div className='char__list'>
				{errorMessage}
				{spinner}
				{content}
				<button
					className='button button__main button__long'
					disabled={moreCharsLoading}
					style={{ display: charEnded ? 'none' : 'block' }}
					onClick={() => this.onRequest(offset)}
				>
					<div className='inner'>load more</div>
				</button>
			</div>
		);
	}
}

const View = ({ characters, onCharSelected }) => {
	return (
		<>
			<ul className='char__grid'>
				{characters.map(character => {
					const imgNotAvailable =
						character.thumbnail ===
						'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg'
							? { objectFit: 'unset' }
							: { objectFit: 'cover' };

					return (
						<li
							key={character.id}
							className='char__item'
							onClick={() => onCharSelected(character.id)}
						>
							<img
								src={character.thumbnail}
								alt={character.name}
								style={imgNotAvailable}
							/>
							<div className='char__name'>{character.name}</div>
						</li>
					);
				})}
			</ul>
		</>
	);
};

export default CharList;
