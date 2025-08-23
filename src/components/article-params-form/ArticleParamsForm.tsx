import { useState, useEffect, useRef, FormEvent } from 'react';
import { ArrowButton } from 'src/ui/arrow-button';
import { Button } from 'src/ui/button';
import clsx from 'clsx';

import styles from './ArticleParamsForm.module.scss';

import { Text } from 'src/ui/text'
import {
	fontFamilyOptions,
	fontSizeOptions,
	fontColors,
	backgroundColors,
	contentWidthArr,
	OptionType,
	ArticleStateType,
	defaultArticleState,
} from 'src/constants/articleProps';
import { Select } from 'src/ui/select';
import { RadioGroup } from 'src/ui/radio-group';
import { Separator } from 'src/ui/separator';


// принимает начальные параметры и колбэк для отправки формы
type ArticleProps = {
	parameters: ArticleStateType;
	onSubmit: (parameters: ArticleStateType) => void;
}

export const ArticleParamsForm = (props: ArticleProps) => {
	// состояние открытия/закрытия сайдбара 
	const [isOpen, setIsOpen] = useState(false);
	// ссылка на DOM-элемент сайдбара
	const sidebarRef = useRef<HTMLFormElement>(null);

	const { parameters, onSubmit } = props;
	const [formState, setFormState] = useState<ArticleStateType>(parameters);
	
	// переключает состояние открытия
	const handleToggle = () => {
		setIsOpen(!isOpen);
	};

	// закрывает сайдбар
	const handleClose = () => {
		setIsOpen(false);
	};

	// клик вне сайдбара
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (sidebarRef.current &&
				!sidebarRef.current.contains(event.target as Node) &&
				isOpen) {
				handleClose();
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [isOpen]);

	// обработчик изменений полей формы
	const handleFieldChange = (field: keyof ArticleStateType) => (option: OptionType) => {
		setFormState(prev => ({ ...prev, [field]: option }));
	};

	const submitForm = (event: FormEvent) => {
		event.preventDefault();
		onSubmit(formState);
	}

	const resetForm = () => {
		setFormState(defaultArticleState);
		onSubmit(defaultArticleState);
	}

	return (
		<>
			<ArrowButton isOpen={isOpen} onClick={handleToggle} />
			<aside
				ref={sidebarRef}
				className={clsx(
					styles.container,
					{ [styles.container_open]: isOpen }
				)}>
				<form className={styles.form} onSubmit={submitForm} ref={sidebarRef}>
					<Text
						as='h1'
						size={31}
						weight={800}
						fontStyle='normal'
						uppercase align='left'>
						Задайте параметры
					</Text>
					<Select
						title='шрифт'
						selected={formState.fontFamilyOption}
						options={fontFamilyOptions}
						onChange={handleFieldChange('fontFamilyOption')}>
					</Select>
					<RadioGroup
						name=''
						options={fontSizeOptions}
						selected={formState.fontSizeOption}
						onChange={handleFieldChange('fontSizeOption')}
						title='размер шрифта'>
					</RadioGroup>
					<Select
						title='цвет шрифта'
						selected={formState.fontColor}
						options={fontColors}
						onChange={handleFieldChange('fontColor')}>
					</Select>
					<Separator />
					<Select
						title='цвет фона'
						selected={formState.backgroundColor}
						options={backgroundColors}
						onChange={handleFieldChange('backgroundColor')}>
					</Select>
					<Select
						title='ширина контента'
						selected={formState.contentWidth}
						options={contentWidthArr}
						onChange={handleFieldChange('contentWidth')}>
					</Select>
					<div className={styles.bottomContainer}>
						<Button title='Сбросить' htmlType='reset' type='clear' onClick={resetForm} />
						<Button title='Применить' htmlType='submit' type='apply' />
					</div>
				</form>
			</aside>
		</>
	);
};
