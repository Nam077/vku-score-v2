import subjects from '../datas/subjects.json';
import { removeAscent } from './string.service.ts';
import { IScore } from '../pages/score/Score.tsx';
import { linearData } from './linear.ts';

interface Subject {
    name: string;
    so_tin_chi: string;
    tags: string[];
}

interface HocPhan {
    id: number;
    name: string;
    countTC: number | string | null;
    countLH: number | string | null;
    scoreCC: number | string | null;
    scoreBT: number | string | null;
    scoreGK: number | string | null;
    scoreCK: number | string | null;
    scoreT10: number | string | null;
    scoreCh: number | string | null;
}

function findTagsByName(name: string | null | undefined, subjects: Subject[]): string[] | undefined {
    for (let i = 0; i < subjects.length; i++) {
        const subject = subjects[i];
        if (subject.name === name) {
            return subject.tags;
        }
    }
    return [];
}

export const recommend = (hocphan: IScore[]) => {
    let tags: { [key: string]: { sum: number; count: number } } = {};

    const score: { [key: string]: number } = {
        A: 4,
        B: 3,
        C: 2,
        D: 1,
        F: 0,
        '': 4,
    };

    for (let i = 0; i < hocphan.length; i++) {
        const subject = hocphan[i];
        const tags_subject = findTagsByName(subject.name, subjects);

        if (tags_subject === undefined) {
            tags = { default: { sum: 0, count: 0 } };
        }

        if (Array.isArray(tags_subject)) {
            for (let j = 0; j < tags_subject.length; j++) {
                if (tags[tags_subject[j]] === undefined) {
                    tags[tags_subject[j]] = { sum: 0, count: 0 };
                }

                tags[tags_subject[j]].sum += score[subject.scoreCh || ''];
                tags[tags_subject[j]].count += 1;
            }
        }
    }

    const recommendHocPhan: {
        id: number;
        name: string;
        sumScoreCh: any;
        countTch: any;
        tags: string[];
        difference: number;
        value: string;
    }[] = [];

    for (let i = 0; i < hocphan.length; i++) {
        const subject = hocphan[i];
        let tags_subject = findTagsByName(subject.name, subjects);

        if (Array.isArray(tags_subject)) {
            tags_subject = tags_subject.sort((a, b) => {
                return tags[b].count - tags[a].count;
            });

            let sumScoreCh = 0;
            let countSubject = 0;
            let sum_difference = 0;

            for (let j = 0; j < tags_subject.length; j++) {
                sumScoreCh = tags[tags_subject[j]].sum;
                countSubject = tags[tags_subject[j]].count;
                sum_difference += (sumScoreCh / countSubject - score[subject.scoreCh || '']) / Math.pow(2, j);
            }

            sum_difference += subject.scoreCh == 'F' ? 10 : 0;

            recommendHocPhan.push({
                id: subject.id,
                name: subject.name || '',
                sumScoreCh: subject.scoreCh,
                countTch: subject.countTC,
                tags: tags_subject,
                difference: sum_difference,
                value: removeAscent(subject.name || ''),
            });
        }
    }

    recommendHocPhan.sort((a, b) => {
        return b.difference - a.difference;
    });
    return recommendHocPhan;
};

interface ResultItem {
    id: number;
    name: string;
    scorePredict: number;
    scoreT10: number;
    difference: number;
    scoreCh: string;
    countTC: string;
}

interface Result {
    [subject: string]: ResultItem;
}
export interface RecommendHocPhan {
    id: number;
    name: string;
    scorePredict: number;
    scoreT10: number | string | null;
    difference: number;
    scoreCh: number | string | null;
    countTC: number | string | null;
}
export const recommendLinear = (scores: IScore[]) => {
    const result: Result = {};
    const recommendHocPhan: RecommendHocPhan[] = [];
    for (let i = 0; i < scores.length; i++) {
        let count = 0;
        let sum = 0;
        const nameSubjectY = scores[i].name;

        for (let j = 0; j < scores.length; j++) {
            const nameSubjectX: string = scores[j].name;
            if (linearData[nameSubjectY] !== undefined) {
                if (linearData[nameSubjectY][nameSubjectX] !== undefined) {
                    if (linearData[nameSubjectY][nameSubjectX].static === 'True') {
                        const slope = linearData[nameSubjectY][nameSubjectX].slope;
                        const intercept = linearData[nameSubjectY][nameSubjectX].intercept;
                        const scoreX: number = parseFloat((scores[j].scoreT10 || '0') as string);
                        const scoreY = parseFloat(slope) * scoreX + parseFloat(intercept);
                        count++;
                        sum = sum + scoreY;
                    }
                }
            }
        }
        const meanScoreY = count == 0 ? 0 : sum / count;
        result[nameSubjectY] = {
            id: scores[i].id,
            name: scores[i].name,
            scorePredict: meanScoreY,
            scoreT10: scores[i].scoreT10 || 0,
            difference: meanScoreY - (scores[i].scoreT10 || 0),
            scoreCh: scores[i].scoreCh || '',
            countTC: (scores[i].countTC || '') as string,
        };
    }

    // convert to array
    for (const subject in result)
        recommendHocPhan.push({
            id: result[subject].id,
            name: subject,
            scorePredict: result[subject].scorePredict,
            scoreT10: result[subject].scoreT10,
            difference: result[subject].scorePredict - result[subject].scoreT10,
            scoreCh: result[subject].scoreCh,
            countTC: result[subject].countTC,
        });

    recommendHocPhan.sort((a, b) => {
        return b.difference - a.difference;
    });
    return recommendHocPhan;
};
