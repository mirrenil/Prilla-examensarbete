import { addDoc, deleteDoc } from 'firebase/firestore';
import { addNewDoc, getAllDocsInCollection } from './helper';
import { Product } from './Interfaces';

export const seed = () => {
	const products: Product[] = [
		{
			brand: 'Loop',
			description:
				'Som alla LOOP-produkter har LOOP Jalapeño Lime Strong en fräsch och angenäm smak som varar länge. Produkten kommer i ett diskret slim-format och ger en fuktig upplevelse utan någon rinnighet.',
			flavor: ['Citrus'],
			format: 'Slim',
			manufacturer: 'Another Snus Factory',
			name: 'Jalapeno Lime',
			nicotine: 15,
			photo:
				'https://media.haypp.com/haypp/images/productgroups-sv-se-102102-g-2022-07-26-113933927/255/255/1/loop-jalapeno-lime.png',
			pouches: 24,
			reviews: [],
			strenght: 3,
			tags: [],
			type: 'Strong',
			weight: 15,
			rating: 0,
			id: '',
		},
		{
			brand: 'Loop',
			description:
				'LOOP Red Chili Melon Strong är helt tobaksfri och är istället tillverkad med en bas av växtfiber. Därefter blir smakämnen och nikotin tillsatt. Prillan är fuktig på utsidan men torr inuti för en smak- och nikotinupplevelse som håller under en längre tid. Nikotinpåsen kommer även i ett slimmat format för en diskret passform under läppen.',
			flavor: ['Citrus'],
			format: 'Slim',
			manufacturer: 'Another Snus Factory',
			name: 'Red Chili Melon',
			nicotine: 15,
			photo:
				'https://media.haypp.com/haypp/images/productgroups-sv-se-303034-g-2022-10-19-072022394/355/355/0/loop-red-chili-melon-strong.png',
			pouches: 24,
			reviews: [],
			strenght: 3,
			tags: [],
			type: 'Strong',
			weight: 15,
			rating: 0,
			id: '',
		},
	];

	// const getAll = async () => {
	// 	console.log('in getAll');
	// 	try {
	// 		let allSnus = await getAllDocsInCollection('produkter');
    //         console.log()
	// 		if (allSnus) {
	// 			for (let snus of allSnus) {
	// 				if (!snus.Name && !snus.name) {
	// 					 await deleteAll(snus.id);
	// 				}
	// 			}
	// 		}
	// 	} catch (err) {
	// 		console.log('err', err);
	// 	}
	// };

	// getAll();

	// const seedDB = async (p: Product) => {
	// 	// let data = await addNewDoc('produkter', p);
	// 	// console.log(data);
	// };

	// products.map((p) => {
	// 	// seedDB(p);
	// });
};
