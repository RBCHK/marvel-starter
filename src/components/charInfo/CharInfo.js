import PropTypes from 'prop-types';
import { Component } from 'react';
import MarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Skeleton from '../skeleton/Skeleton';
import Spinner from '../spinner/Spinner';

import './charInfo.scss';

class CharInfo extends Component {
	state = {
		character: null,
		loading: false,
		error: false,
	};

	marvelService = new MarvelService();

	componentDidMount() {
		this.updateChar();
	}

	componentDidUpdate(prevProps, prevState) {
		if (this.props.charId !== prevProps.charId) {
			this.updateChar();
		}
	}

	updateChar = () => {
		const { charId } = this.props;

		if (!charId) return;

		this.setState({ loading: true });

		this.marvelService
			.getCharacter(charId)
			.then(character =>
				this.setState({
					character: character,
					loading: false,
				})
			)
			.catch(() => {
				this.setState({
					loading: false,
					error: true,
				});
			});
	};

	render() {
		const { character, loading, error } = this.state;

		const skeleton = character || loading || error ? null : <Skeleton />;
		const errorMessage = error ? <ErrorMessage /> : null;
		const spinner = loading ? <Spinner /> : null;
		const content = loading || error || !character ? null : <View char={character} />;

		return (
			<div className='char__info'>
				{skeleton}
				{errorMessage}
				{spinner}
				{content}
			</div>
		);
	}
}

const View = ({ char }) => {
	const { name, thumbnail, description, wiki, homepage, comics } = char;

	const imgNotAvailable =
		thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg'
			? { objectFit: 'unset' }
			: { objectFit: 'cover' };

	return (
		<>
			<div className='char__basics'>
				<img src={thumbnail} alt={name} style={imgNotAvailable} />
				<div>
					<div className='char__info-name'>{name}</div>
					<div className='char__btns'>
						<a href={homepage} className='button button__main'>
							<div className='inner'>homepage</div>
						</a>
						<a href={wiki} className='button button__secondary'>
							<div className='inner'>Wiki</div>
						</a>
					</div>
				</div>
			</div>

			<div className='char__descr'>
				{description ? description : <div>Ooops.. There is no description.</div>}
			</div>

			<div className='char__comics'>Comics:</div>
			<ul className='char__comics-list'>
				{comics
					? comics.slice(0, 10).map(obj => {
							const key = obj.resourceURI.slice(-4);
							return (
								<li key={key} className='char__comics-item'>
									{obj.name}
								</li>
							);
					  })
					: 'There is no comics here.'}
			</ul>
		</>
	);
};

CharInfo.propTypes = {
	charId: PropTypes.number,
};

export default CharInfo;
