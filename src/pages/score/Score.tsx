import { FunctionComponent, useEffect, useState } from 'react';
import { removeAscent } from '../../services/string.service.ts';
import { FileWithPath } from 'react-dropzone';
import CustomDropzone from '../../components/CustomDropzone.tsx';
import TableScore from '../../components/TableScore.tsx';
import { ScoreService } from '../../services/score.service.ts';

export interface IScore {
    value: string;
    key?: number | null;
    id: number;
    name: string;
    countTC?: number | null;
    countLH?: number | null;
    scoreCC?: number | null;
    scoreBT?: number | null;
    scoreGK?: number | null;
    scoreCK?: number | null;
    scoreT10?: number | null;
    scoreCh?: string | null;
}
const scoreService = new ScoreService();
const validateData = (scores: IScore[]): IScore[] => {
    scores = scores.map((score, index) => {
        score.key = index + 1;
        score.id = index + 1;
        score.value = removeAscent(score.name);
        return score;
    });
    return scores;
};
const generateScoreIdUnique = (scores: IScore[]): number => {
    return Math.max(...scores.map((score) => score.id)) + 1;
};

const checkNameExist = (scores: IScore[], name: string): boolean => {
    return scores.some((score) => score.value === name);
};
const readJsonFile = async (file: File) => {
    const fileContent = await file.text();
    return JSON.parse(fileContent);
};
const Score: FunctionComponent = () => {
    const [scoreData, setScoreData] = useState<IScore[]>([]);
    const [scoreModified, setScoreModified] = useState<IScore[]>([]);
    const [currentGPA, setCurrentGPA] = useState<number>(0);
    const [newGPA, setNewGPA] = useState<number>(0);
    const onFilesSelected = async (files: FileWithPath[]) => {
        const file = files[0];
        readJsonFile(file).then((res) => {
            if (!res.scoreAll) {
                // openNotification('File tải lên không đúng!', 'error');
                return;
            }
            res.scoreAll.forEach((item: any) => {
                item.key = item.id;
                item.value = removeAscent(item.name);
            });
            const scoreUpload = validateData(res.scoreAll);
            setScoreData(scoreUpload);
            setScoreModified(scoreUpload);
            scoreService.setScore(scoreUpload);
            setCurrentGPA(scoreService.calcGPA());
            setNewGPA(scoreService.calcGPA());
        });
    };
    useEffect(() => {
        scoreService.setScore(scoreModified);
        setNewGPA(scoreService.calcGPA());
    }, [scoreModified]);

    const addScore = (score: IScore) => {
        if (checkNameExist(scoreData, score.value)) {
            return;
        }
        score.id = generateScoreIdUnique(scoreData);
        setScoreData([...scoreData, score]);
        setScoreModified([...scoreModified, score]);
    };

    const removeScore = (score: IScore) => {
        const index = scoreData.findIndex((s) => s.id === score.id);
        if (index === -1) {
            return;
        }
        setScoreData([...scoreData.slice(0, index), ...scoreData.slice(index + 1)]);
    };

    const updateScoreModifiedByValue = (value: string, scoreCh: string) => {
        const index = scoreModified.findIndex((s) => s.value === value);
        if (index === -1) {
            return;
        }
        setScoreModified([
            ...scoreModified.slice(0, index),
            { ...scoreModified[index], scoreCh },
            ...scoreModified.slice(index + 1),
        ]);
    };

    const updateScoreModified = (score: IScore) => {
        setScoreModified(
            scoreModified.map((s) => {
                if (s.id === score.id) {
                    return { ...s, ...score };
                }
                return s;
            }),
        );
    };

    return (
        <div>
            <CustomDropzone onFilesSelected={onFilesSelected} />
            <div style={{ marginTop: '20px' }}>
                <p>GPA: {currentGPA}</p>
                <p>GPA: {newGPA}</p>
            </div>
            {scoreData.length > 0 && (
                <div style={{ marginTop: '20px' }}>
                    <TableScore scores={scoreData} changeModified={updateScoreModified} scoreModified={scoreModified} />
                </div>
            )}
        </div>
    );
};

export default Score;
